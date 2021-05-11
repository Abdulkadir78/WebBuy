const router = require("express").Router();

const {
  signup,
  login,
  profile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  updateRole,
} = require("../controllers/users");

const { ensureAuthenticated, ensureAdmin } = require("../middleware/auth");
const { ensureValidUserId } = require("../middleware/validation");

router.post("/signup", signup);
router.post("/login", login);

router
  .route("/profile")
  .get(ensureAuthenticated, profile)
  .patch(ensureAuthenticated, updateProfile);

router.get("/", ensureAuthenticated, ensureAdmin, getAllUsers);

router
  .route("/:userId")
  .get(ensureAuthenticated, ensureAdmin, ensureValidUserId, getUserById)
  .delete(ensureAuthenticated, ensureAdmin, ensureValidUserId, deleteUser);

router.patch(
  "/:userId/updateRole",
  ensureAuthenticated,
  ensureAdmin,
  ensureValidUserId,
  updateRole
);

module.exports = router;
