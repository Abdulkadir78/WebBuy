const notFound = (req, res) => {
  res.status(404);
  throw new Error("Route not found");
};

const errorHandler = (err, req, res, next) => {
  // handle validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors);
    const errorMsgs = errors.map((error) => error.message);

    return res.status(400).json({ error: errorMsgs, success: false });
  }

  // handle duplicate key errors (ex: duplicate email)
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue);

    return res.status(409).json({
      error: `An account with that ${field} already exists`,
      success: false,
    });
  }

  // handle image upload errors
  if (err.name === "MulterError") {
    res.status(400);

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.json({
        error: "Images must be a maximum of 2MB each",
        success: false,
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.json({
        error: "Maximum 3 images are allowed",
        success: false,
      });
    }

    return res.json({ error: err.message, success: false });
  }

  // handle all other errors
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res
    .status(status)
    .json({ error: err.message || "Something went wrong", success: false });
};

module.exports = { notFound, errorHandler };
