const express = require("express");

const router = express.Router();

const {
  ensureAuthenticated,
  ensureAdmin,
  ensureSeller,
} = require("../middleware/auth");

const {
  ensureValidOrderId,
  ensureValidUserId,
} = require("../middleware/validation");

const {
  addOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  getSellersOrders,
  updateOrderToDelivered,
  createCheckoutSession,
  createWebhook,
  updateOrderToPaid,
} = require("../controllers/orders");

router
  .route("/")
  .get(ensureAuthenticated, ensureAdmin, getAllOrders)
  .post(ensureAuthenticated, addOrder);

router.get("/myOrders", ensureAuthenticated, getMyOrders);
router.get("/:orderId", ensureAuthenticated, ensureValidOrderId, getOrderById);

router.get(
  "/sellerOrders/:userId",
  ensureAuthenticated,
  ensureSeller,
  ensureValidUserId,
  getSellersOrders
);

router.patch(
  "/:orderId/deliver",
  ensureAuthenticated,
  ensureAdmin,
  ensureValidOrderId,
  updateOrderToDelivered
);

router.post(
  "/checkoutSession/:orderId",
  ensureAuthenticated,
  ensureValidOrderId,
  createCheckoutSession
);

router.post("/webhook", createWebhook);

router.patch(
  "/:orderId/pay",
  ensureAuthenticated,
  ensureValidOrderId,
  updateOrderToPaid
);

module.exports = router;
