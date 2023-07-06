const express = require("express");
const User = require("../model/UserModel");
const asyncHandler = require("express-async-handler");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");

// creating a register endpoint
// check if user already exists
// hashed the password
// create a new user to the database

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

  const availableUser = await User.findOne({ email });
  if (availableUser) res.status(400).json({ error: "user already exists" });

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
// check if user exists in the database
// compare password provided with hashed password
// generate access token

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).json({ error: "all fields are mandatory" });
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "user not found" });
  }

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
// check if email is in the database
// generate reset token
// save reset token in user document

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "User does not exist." });
  }

  const resetToken = await jwt.sign(
    { _id: user.id },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
  console.log("resetToken", resetToken);

  user.token = resetToken;
  await user.save();

  console.log("user", user);

  return res.status(200).json({ message: "Token sent to the provided email." });
});

// reset password endpoint
// check if user exist in the dataase
// verify if the token provided is the same as token in the database
// hash the provided password
// update the user and clear the token

const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password)
    return res.status(400).json({ error: "All fields are mandatory." });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found." });

  if (token) {
    jwt.verify(token, process.env.RESET_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(400);
        throw new Error("invalid or expired token");
      }
      req.user = decoded.user;
    });
  }

  const hashedPassword = await bcyrpt.hash(password, 10);

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword, token: "" },
    { new: true }
  );
  console.log(updatedUser);
  if (updatedUser) {
    return res.status(200).json({
      _id: user.id,
      email: user.email,
      message: "Password reset successfully.",
    });
  } else {
    return res.status(500).json({
      error: "Failed to update the user's password. Please try again.",
    });
  }
});

// creating a update table endpoint for databasae
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
