const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Staff = require("../model/StaffModel");

// creating a resigter endpoint for staff
// check if staff already exists in the database
// hash the password
// save staff to database

const registerStaff = asyncHandler(async (req, res) => {
  const { username, email, firstName, lastName, phoneNumber, password } =
    req.body;
  if (!username || !email || !firstName || !lastName || !phoneNumber) {
    res.status(400).json({ error: "All fields are mandatory" });
  }
  const availableStaff = await Staff.findOne({ email });
  if (availableStaff) {
    res.status(400).json({ error: "staff already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  const staff = await Staff.create({
    email: email,
    lastName: lastName,
    firstName: firstName,
    phoneNumber: phoneNumber,
    username: username,
    password: hashedPassword,
  });
  console.log(staff);
  if (!staff) {
    res.status(400).json({ error: "Staff data not valid" });
  }
  res.status(200).json({
    _id: staff.id,
    username: staff.username,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phoneNumber: staff.phoneNumber,
    message: "Staff created successfully",
  });
});

// creating a login endpoint for staff
// check if staff already exists in the database
// compare the pasword with the hashed password in database
// generate accesss token

const staffLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "all fields are mandatory" });
  }
  const staff = await Staff.findOne({ email });
  if (!staff) {
    res.status(404).json({ error: "staff not found" });
  }
  if (staff && (await bcrypt.compare(password, staff.password))) {
    const accessToken = await jwt.sign(
      {
        staff: {
          id: staff.id,
        },
      },
      process.env.STAFF_ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    res
      .status(200)
      .json({ accessToken, _id: staff.id, username: staff.username });
  } else {
    res.status(401).json({ error: "email or password is invalid" });
  }
});

module.exports = { registerStaff, staffLogin };
