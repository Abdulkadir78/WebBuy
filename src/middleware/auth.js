const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../db/models/User");

const ensureAuthenticated = async (req, res, next) => {
  try {
    // get the token from the header
    const token = req.headers.authorization.split("Bearer ")[1];
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: "Please login to continue", success: false });
  }
};

const ensureAdmin = asyncHandler((req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  res.status(401);
  throw new Error("Not authorized as an admin");
});

const ensureSeller = asyncHandler((req, res, next) => {
  if (req.user.role === "seller") {
    return next();
  }
  res.status(401);
  throw new Error("Not authorized as a seller");
});

const ensureAdminOrSeller = asyncHandler((req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "seller") {
    return next();
  }
  res.status(401);
  throw new Error("Not authorized as an admin or a seller");
});

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
  ensureSeller,
  ensureAdminOrSeller,
};
