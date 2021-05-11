const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validEmail } = require("../../utils/validation");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [30, "Name cannot be more than 30 characters long"],
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
      validate: {
        validator(value) {
          return validEmail(value);
        },
        message: "Invalid email",
      },
      // validate(value) {
      //   if (!validEmail(value)) {
      //     throw new Error("Invalid email");
      //   }
      // },
    },
    password: {
      type: String,
      minlength: [6, "Password should be atleast 6 characters long"],
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      trim: true,
      enum: {
        values: ["user", "seller", "admin"],
        message: "Role can only be one of 'user', 'seller' or 'admin'",
      },
      default: "user",
      required: [true, "Role is required"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.checkPassword = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
