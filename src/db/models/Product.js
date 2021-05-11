const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters long"],
    },
    body: {
      type: String,
      trim: true,
      maxlength: [500, "Review body cannot be more than 500 characters long"],
    },
    rating: {
      type: Number,
      min: [1, "1 is the minimum rating"],
      max: [5, "5 is the maximum rating"],
      required: [true, "Rating is required"],
      validate: {
        validator: Number.isInteger,
        message: "Rating has to be an integer between 1 and 5",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author information is required"],
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters long"],
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters long"],
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: {
        values: [
          "fashion",
          "mobiles",
          "electronics",
          "appliances",
          "furniture",
          "grocery",
          "others",
        ],
        message: "Invalid category",
      },
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      min: [1, "Price should be atleast ₹1"],
      max: [990000, "Price should not exceed ₹990,000"],
      required: [true, "Price is required"],
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    images: {
      type: Array,
      validate: {
        validator(images) {
          return Array.isArray(images) && images.length > 0;
        },
        message: "Image is required",
      },
    },
    reviews: [reviewSchema],
    numberOfReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller id is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
