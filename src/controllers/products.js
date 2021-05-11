const asyncHandler = require("express-async-handler");

const Product = require("../db/models/Product");
const calculateRating = require("../utils/calculateRating");
const { uploadImage, deleteImage } = require("../utils/imageStorage");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json({ products: products.reverse(), success: true });
});

// @desc    Get one product
// @route   GET /api/products/:productId
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // get the seller details from seller id on the product
  await product.populate("seller").execPopulate();
  await product.populate("reviews.author").execPopulate();

  res.json({ product, success: true });
});

// @desc    Get seller's products
// @route   POST /api/products/sellersProducts/:userId
// @access  Private/Seller
const getSellersProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json({ products: products.reverse(), success: true });
});

// @desc    Add a product
// @route   POST /api/products
// @access  Private/Seller
const addProduct = asyncHandler(async (req, res) => {
  if (req.fileError) {
    res.status(400);
    throw new Error(req.fileError);
  }

  // upload images to storage
  const promises = [];
  req.files &&
    req.files.forEach((file) => {
      const promise = uploadImage(file);
      promises.push(promise);
    });

  // resolve all promises to get the image urls
  const urls = await Promise.all(promises);

  const product = new Product({
    ...req.body,
    seller: req.user._id,
    images: urls,
  });
  await product.save();

  res
    .status(201)
    .json({ product, message: "Product added successfully", success: true });
});

// @desc    Delete a product
// @route   DELETE /api/products/:productId
// @access  Private/Admin/Seller
const deleteProduct = asyncHandler(async (req, res) => {
  // if user is an admin then delete the product
  // if user is a seller then check if they own the product then delete
  const product =
    req.user.role === "admin"
      ? await Product.findById(req.params.productId)
      : await Product.findOne({
          _id: req.params.productId,
          seller: req.user._id,
        });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // delete images from storage
  const promises = [];
  product.images &&
    product.images.forEach((fileUrl) => {
      const promise = deleteImage(fileUrl);
      promises.push(promise);
    });

  await Promise.all(promises);
  await product.remove();

  res.json({ message: "Product deleted successfully", success: true });
});

// @desc    Update a product
// @route   PATCH /api/products/:productId
// @access  Private/Seller
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.productId,
    seller: req.user._id,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const requestedUpdates = Object.keys(req.body);
  const allowedUpdates = ["name", "description", "category", "price", "stock"];

  if (requestedUpdates.length) {
    const match = requestedUpdates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!match) {
      res.status(400);
      throw new Error("Invalid update field");
    }

    requestedUpdates.forEach((update) => {
      product[update] = req.body[update];
    });
    await product.save();

    return res.json({
      product,
      message: "Details updated successfully",
      success: true,
    });
  }

  res.json({ success: true });
});

// @desc    Review a product
// @route   POST /api/products/:productId/review
// @access  Private
const reviewProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.author.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(409);
    throw new Error("Product already reviewed");
  }

  const newReview = {
    title: req.body.title,
    body: req.body.body,
    rating: req.body.rating,
    author: req.user._id,
  };

  product.reviews.unshift(newReview);

  if (req.body.rating) {
    product.numberOfReviews = product.reviews.length;
    product.rating = calculateRating(product);
  }

  await product.save();

  res.status(201).json({ message: "Review added successfully", success: true });
});

// @desc    Delete a review
// @route   DELETE /api/products/:productId/review/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  // admins can delete all reviews
  const review =
    req.user.role === "admin"
      ? product.reviews.find(
          ({ _id }) => _id.toString() === reviewId.toString()
        )
      : product.reviews.find(
          ({ _id, author }) =>
            _id.toString() === reviewId.toString() &&
            author.toString() === req.user._id.toString()
        );

  if (!review) {
    res.status(400);
    throw new Error("Review not found");
  }
  await review.remove();

  product.numberOfReviews -= 1;

  // check if the no. of reviews is 0 before calculating the rating because
  // numberOfReviews will be 0 if we delete the last review and we will get a
  // divide by 0 error in the calculation
  // if numberOfReviews is 0 then rating will be set to 0
  product.rating = product.numberOfReviews === 0 ? 0 : calculateRating(product);

  await product.save();

  res.json({ message: "Review deleted successfully", success: true });
});

// @desc    Update a review
// @route   PATCH /api/products/:productId/review/:reviewId
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  const review = product.reviews.find(
    ({ _id, author }) =>
      _id.toString() === reviewId.toString() &&
      author.toString() === req.user._id.toString()
  );

  if (!review) {
    res.status(400);
    throw new Error("Review not found");
  }

  /* 
    since title and body are not required, if a user passes an empty title/body
    we should remove the title/body but, the 'or' operator (||) checks for empty
    strings so the user would have to pass an space character in the title/body (" ")
    to remove the review title/body
    Workaround - The nullish coalescing operator (??)
    It only checks for null or undefined values and not empty strings
    So if the left hand side value is null/undefined only then the right hand side
    value will be used
    Note - if a user does not pass in the title/body, then req.body.title/req.body.body 
    would be null and the right hand side value will be used
    Also rating cannot be zero and ?? does not check for falsy values so here
    review.rating will be set to 0 if user passes 0 and mongoose will throw an error 
    instead of silently using the right hand side value
  */
  if (Object.keys(req.body).length > 0) {
    review.title = req.body.title ?? review.title;
    review.body = req.body.body ?? review.body;
    review.rating = req.body.rating ?? review.rating;

    if (req.body.rating) {
      product.rating = calculateRating(product);
    }

    await product.save();

    res.json({ message: "Review updated successfully", success: true });
  }

  res.json({ success: true });
});

module.exports = {
  getProducts,
  getProductById,
  getSellersProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  reviewProduct,
  deleteReview,
  updateReview,
};
