const express = require("express");
const router = express.Router();
const {
  addProductCategory,
  getProductCategory,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
} = require("../controllers/ProductCategoryController");

router.post("/", addProductCategory);
router.get("/", getProductCategory);
router.get("/:id", getProductCategoryById);
router.post("/:id", updateProductCategory);
router.delete("/:id", deleteProductCategory);

module.exports = router;
