const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../db/models/Order");

// @desc    Add an order
// @route   POST /api/orders
// @access  Private
const addOrder = asyncHandler(async (req, res) => {
  const total =
    req.body.orderItems &&
    req.body.orderItems.reduce(
      (acc, item) => acc + parseFloat(item.price, 10) * item.quantity,
      0
    );

  if (Number.isNaN(total)) {
    res.status(400);
    throw new Error("Make sure all the product prices are valid numbers");
  }

  const order = new Order({
    ...req.body,
    total,
    buyer: req.user._id,
  });

  await order.save();
  res.status(201).json({ order, success: true });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json({ orders: orders.reverse(), success: true });
});

// @desc    Get user's orders
// @route   GET /api/orders/myOrders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id });
  res.json({ orders: orders.reverse(), success: true });
});

// @desc    Get order by id
// @route   GET /api/orders/:orderId
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  // admins can see all orders
  // other users can only see their own orders
  const order =
    req.user.role === "admin" || req.user.role === "seller"
      ? await Order.findById(req.params.orderId)
      : await Order.findOne({
          _id: req.params.orderId,
          buyer: req.user._id,
        });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ order, success: true });
});

// @desc    Get seller's orders
// @route   POST /api/orders/sellersOrders/:userId
// @access  Private/Seller
const getSellersOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "orderItems.seller": req.user._id });
  res.json({ orders: orders.reverse(), success: true });
});

// @desc    Update order to delivered
// @route   PATCH /api/orders/:orderId/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isDelivered) {
    res.status(409);
    throw new Error(`Order already delivered on ${order.deliveredAt}`);
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  if (order.paymentMethod === "COD") {
    order.isPaid = true;
    order.paidAt = Date.now();
  }
  const updatedOrder = await order.save();

  res.json({ updatedOrder, success: true });
});

// @desc    Create a stripe checkout session
// @route   POST /api/orders/checkoutSession/:orderId
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    buyer: req.user._id,
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.isPaid) {
    res.status(409);
    throw new Error(`Payment already done on ${order.paidAt}`);
  }

  const lineItems = req.body.orderItems.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    payment_intent_data: {
      metadata: {
        customerId: req.user._id.toString(),
        orderId: req.params.orderId,
      },
    },
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.DOMAIN}/order/${req.params.orderId}`,
    cancel_url: `${process.env.DOMAIN}/order/${req.params.orderId}`,
  });

  res.json({ id: session.id });
});

// @desc    Create a stripe webhook
// @route   POST /api/orders/webhook
// @access  Private
const createWebhook = asyncHandler(async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // see app.js in express.json()
      req.headers["stripe-signature"],
      process.env.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    return res
      .status(400)
      .json({ error: `Webhook Error: ${err.message}`, success: false });
  }

  if (event.type === "charge.succeeded") {
    const { orderId, customerId } = event.data.object.metadata;
    const order = await Order.findOne({
      _id: orderId,
      buyer: customerId,
    });

    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();
  }

  res.status(200);
});

// @desc    Update order to paid
// @route   PATCH /api/orders/:orderId/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    buyer: req.user._id,
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isPaid) {
    res.status(409);
    throw new Error(`Payment already done on ${order.paidAt}`);
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();

  res.json({ updatedOrder, success: true });
});

module.exports = {
  addOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  getSellersOrders,
  updateOrderToDelivered,
  createCheckoutSession,
  createWebhook,
  updateOrderToPaid,
};
