const asyncHandler = require("express-async-handler");

const User = require("../db/models/User");

// @desc    Create a new user
// @route   POST /api/users/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  // confirm password is not saved in the database therefore
  // the user model won't validate it
  if (!req.body.confirmPassword) {
    res.status(400);
    throw new Error("Confirm password is required");
  }

  if (req.body.password !== req.body.confirmPassword) {
    res.status(400);
    throw new Error("Passwords don't match");
  }

  const user = new User({ ...req.body, role: "user" });
  await user.save();

  res.status(201).json({ message: "Singup successful", success: true });
});

// @desc    Login and generate a token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required to login");
  }

  const user = await User.findOne({ email });

  if (user && (await user.checkPassword(password))) {
    const token = user.generateAuthToken();
    return res.cookie("token", token).json({ token, success: true });
  }

  res.status(401);
  throw new Error("Invalid credentials");
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const profile = asyncHandler(async (req, res) => {
  res.json({ user: req.user, success: true });
});

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];

  // update user info if new info is passed
  if (requestedUpdates.length) {
    const match = requestedUpdates.every((update) =>
      allowedUpdates.includes(update)
    );

    // user can only update the allowed fields
    if (!match) {
      res.status(400);
      throw new Error("Invalid update field");
    }

    requestedUpdates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    return res.json({
      message: "Details updated successfully",
      user: req.user,
      success: true,
    });
  }

  // if new info is not passed, do nothing
  res.json({ success: true });

  /*
   ------ Alternate solution (this won't check for invalid update fields or validation errors) -----

   if (Object.keys(req.body).length > 0) {
     req.user.name = req.body.name ?? req.user.name;
     req.user.email = req.body.email ?? req.user.email;
     req.user.password = req.body.password ?? req.user.password;

     await req.user.save();
     res.json({
       user: req.user,
       message: "Details updated successfully",
       success: true,
     });
   }
  res.send();
  */
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ users: users.reverse(), success: true });
});

// @desc    Get one user
// @route   GET /api/users/:userId
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ user, success: true });
});

// @desc    Delete a user
// @route   DELETE /api/users/:userId
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.deleteOne({ _id: req.params.userId });

  if (!user.n) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ message: "User deleted successfully", success: true });
});

// @desc    Update user's role
// @route   PATCH /api/users/:userId/updateRole
// @access  Private/Admin
const updateRole = asyncHandler(async (req, res) => {
  if (!req.body.role) {
    res.status(400);
    throw new Error("Please provide a role");
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = req.body.role;
  await user.save();

  res.json({
    user,
    message: "Role updated successfully",
    success: true,
  });
});

module.exports = {
  signup,
  login,
  profile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  updateRole,
};
