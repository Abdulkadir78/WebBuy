const mongoose = require("mongoose");

const orderItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Product",
    required: [true, "Product id is required"],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Seller id is required"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      enum: {
        values: ["card", "COD"],
        message: "Payment method can only be one of 'card' or 'COD'",
      },
      required: [true, "Payment method is required"],
    },
    shippingAddress: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },
    orderItems: {
      type: [orderItemsSchema],
      validate: {
        validator(orderItems) {
          return Array.isArray(orderItems) && orderItems.length > 0;
        },
        message: "Order must contain atleast 1 product",
      },
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: [true, "isPaid is required"],
    },
    isDelivered: {
      type: Boolean,
      default: false,
      required: [true, "isDelivered is required"],
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
      required: [true, "Buyer info is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
