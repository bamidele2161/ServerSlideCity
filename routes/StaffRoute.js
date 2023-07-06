const express = require("express");
const router = express.Router();
const { registerStaff, staffLogin } = require("../controllers/StaffController");

router.post("/register", registerStaff);
router.post("/login", staffLogin);
module.exports = router;
