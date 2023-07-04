const express = require("express");
const User = require("../model/UserModel");
const asyncHandler = require("express-async-handler");
const bcyrpt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// creating a register endpoint

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName, phoneNumber } =
    req.body;
  if (
    !username ||
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !phoneNumber
  )
    res.status(400).json({ error: "all fields are mandatory" });

  //checking if user already exists

  const availableUser = await User.findOne({ email });
  if (availableUser) res.status(400).json({ error: "user already exists" });

  //hashed password

  const hashedPassword = await bcyrpt.hash(password, 10);
  console.log(hashedPassword);
  const user = await User.create({
    username,
    email,
    firstName,
    lastName,
    phoneNumber,
    password: hashedPassword,
  });
  console.log(user);
  if (!user) res.status(400).json({ error: "User data not valid" });
  res.status(200).json({
    _id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
  });
});

//Creating a login endpoint
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).json({ error: "all fields are mandatory" });
  const user = await User.findOne({ email });

  //comapring password with hashed password
  if (user && (await bcyrpt.compare(password, user.password))) {
    const accessToken = await jwt.sign(
      {
        user: {
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    res
      .status(200)
      .json({ accessToken, _id: user.id, username: user.username });
  } else {
    res.status(401).json({ error: "email or password is not valid" });
  }
});

// Reset Password Endpoint
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "User does not exist." });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log("resetToken", resetToken);

  // Save reset token in user document
  user.token = resetToken;
  await user.save();

  console.log("user", user);

  return res.status(200).json({ message: "Token sent to the provided email." });
});

// reset password endpoint
const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password)
    return res.status(400).json({ error: "All fields are mandatory." });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found." });

  const isValidToken = await bcyrpt.compare(token, user.token);
  console.log(isValidToken);
  if (user && isValidToken) {
    const hashedPassword = await bcyrpt.hash(password, 10);

    // Update the user's password and clear the token
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, token: "" },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        data: updatedUser,
        message: "Password reset successfully.",
      });
    } else {
      return res.status(500).json({
        error: "Failed to update the user's password. Please try again.",
      });
    }
  } else {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
});

const test = async (req, res) => {
  try {
    const update = await User.updateMany({}, { $set: { token: "" } });
    console.log(update);
    if (!update) {
      return res.status(400).json({ error: "Error occured !" });
    }

    return res.status(200).json({ message: "successful!" });
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
module.exports = {
  registerUser,
  userLogin,
  test,
  forgotPassword,
  resetPassword,
};
