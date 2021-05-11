const { validObjectId } = require("../utils/validation");

// to check whether the id passed in the params is valid

const ensureValidUserId = (req, res, next) => {
  if (!validObjectId(req.params.userId)) {
    res.status(400);
    throw new Error("Invalid user id");
  }
  next();
};

const ensureValidProductId = (req, res, next) => {
  if (!validObjectId(req.params.productId)) {
    res.status(400);
    throw new Error("Invalid product id");
  }
  next();
};

const ensureValidReviewId = (req, res, next) => {
  if (!validObjectId(req.params.reviewId)) {
    res.status(400);
    throw new Error("Invalid review id");
  }
  next();
};

const ensureValidOrderId = (req, res, next) => {
  if (!validObjectId(req.params.orderId)) {
    res.status(400);
    throw new Error("Invalid order id");
  }
  next();
};

module.exports = {
  ensureValidUserId,
  ensureValidProductId,
  ensureValidReviewId,
  ensureValidOrderId,
};
