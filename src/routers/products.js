const router = require("express").Router();

const {
  getProducts,
  getProductById,
  getSellersProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  reviewProduct,
  deleteReview,
  updateReview,
} = require("../controllers/products");

const {
  ensureAuthenticated,
  ensureSeller,
  ensureAdminOrSeller,
} = require("../middleware/auth");

const {
  ensureValidProductId,
  ensureValidReviewId,
  ensureValidUserId,
} = require("../middleware/validation");

const imageUpload = require("../middleware/imageUpload");

router
  .route("/")
  .get(getProducts)
  .post(ensureAuthenticated, ensureSeller, imageUpload, addProduct);

router
  .route("/:productId")
  .get(ensureValidProductId, getProductById)
  .delete(
    ensureAuthenticated,
    ensureAdminOrSeller,
    ensureValidProductId,
    deleteProduct
  )
  .patch(
    ensureAuthenticated,
    ensureSeller,
    ensureValidProductId,
    updateProduct
  );

router.get(
  "/sellerProducts/:userId",
  ensureAuthenticated,
  ensureSeller,
  ensureValidUserId,
  getSellersProducts
);

router.post(
  "/:productId/review",
  ensureAuthenticated,
  ensureValidProductId,
  reviewProduct
);

router
  .route("/:productId/review/:reviewId")
  .delete(
    ensureAuthenticated,
    ensureValidProductId,
    ensureValidReviewId,
    deleteReview
  )
  .patch(
    ensureAuthenticated,
    ensureValidProductId,
    ensureValidReviewId,
    updateReview
  );

module.exports = router;
