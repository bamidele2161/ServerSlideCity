const express = require("express");
const {
  registerUser,
  userLogin,
  forgotPassword,
  test,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();

//routes
router.post("/register", registerUser);
router.post("/login", userLogin);
router.post("/forgotPassword", forgotPassword);
router.post("/test", test);
router.post("/resetPassword", resetPassword);
module.exports = router;
