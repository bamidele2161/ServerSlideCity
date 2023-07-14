const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateTokenStaff = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.STAFF_ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.staff = decoded.staff;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("User not authorized or token has expired");
    }
  }
});

module.exports = validateTokenStaff;
