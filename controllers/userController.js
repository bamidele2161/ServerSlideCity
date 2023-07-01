const express = require("express");
const User = require("../model/UserModel");
const asyncHandler = require("express-async-handler");
const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// creating a register endpoint

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
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
    password: hashedPassword,
  });
  console.log(user);
  if (user) res.status(200).json({ _id: user.id, email: user.email });
  else {
    res.status(400);
  }
  throw new Error("user data not valid");
});

//Creating a login endpoint
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).json({ error: "all fields are mandatory" });
  const user = User.findOne({ email });

  //comapring password with hashed password
  if (user && (await bcyrpt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ error: "email or password is not valid" });
  }
});

// Reset Password Endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) res.status(400).json({ error: "email is required" });
  const user = await User.findOne({ email: email });
  if (!user) res.status(400).json({ error: "user does not exist" });
  // let token = await Token.findOne({ userId: user._id });
  // if (token) await Token.deleteOne();

  // generating a reset token
  let resetToken = await crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcyrpt.hash(resetToken, 10);

  // await new Token({
  //   userId: user._id,
  //   token: hashedToken,
  //   createdAt: Date.now(),
  // }).save();
  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        token: hashedToken,
      },
    }
  );
  if (updatedUser)
    res.status(200).json({ message: "token sent to email provided" });
  else {
    res.status(400).json({ error: "error occured while updating user" });
  }
};

// reset password endpoint
const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !password)
    res.status(400).json({ error: "all fields are mandatory" });

  const user = await User.findOne({ email: email });
  if (!user) res.status(400).json({ error: "user not found" });
  const isValid = await bcyrpt.compare(token, user.token);
  if (user && isValid) {
    const hashedPassword = await bcyrpt.hash(password, 10);
    const updatedUser = await User.updateOne(
      {
        email: user.email,
      },
      {
        $set: {
          password: hashedPassword,
          token: "",
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedUser);
    return res
      .status(200)
      .json({ data: updatedUser, message: "password reset successfully" });
  } else {
    {
      res.status(400).json({ error: "invalid or expired token" });
    }
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
