const ProductCategory = require("../model/ProductCategoryModel");
const asyncHandler = require("express-async-handler");

// creating an endpoint to add new product category

const addProductCategory = asyncHandler(async (req, res) => {
  // check if the category already exists in the database
  // save the category to the database
  const { name, description } = req.body;
  if ((!name, !description))
    res.status(400).json({ error: "all fields are mandatory" });
  const availableProductCategory = await ProductCategory.findOne({ name });
  if (availableProductCategory)
    res.status(400).json({ error: "category already exists" });
  const productCategory = await ProductCategory.create({
    name,
    description,
  });
  res.status(200).json({
    data: productCategory,
    message: "Product category created successfully",
  });
});

// creating a get all product category endpoint

const getProductCategory = asyncHandler(async (req, res) => {
  const productCategory = await ProductCategory.find().populate("category_id");
  if (!productCategory)
    res.status(400).json({ error: "cannot find all product category" });
  res.status(200).json({
    data: productCategory,
    message: "product category gotten successfully!",
  });
});

// getting product category by id
const getProductCategoryById = asyncHandler(async (req, res) => {
  // find the product category by id in the database
  // check if it exists
  // return the product category to the user
  const { id } = req.params;
  const productCategory = await ProductCategory.findById(id);
  if (!productCategory) {
    res
      .status(400)
      .json({ error: `cannot find product category with the ID ${id}` });
  }
  res.status(200).json({
    data: productCategory,
    message: "product category gotten successfully",
  });
});

// updating product category
const updateProductCategory = asyncHandler(async (req, res) => {
  // take the payload from the staff
  // find the product category by id in the database
  // update and return it to the staff
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ error: "all fields are mandatory" });
  }
  const productCategory = await ProductCategory.findByIdAndUpdate(id, req.body);
  if (!productCategory) {
    res
      .status(400)
      .json({ error: `cannot find the product category with the ID ${id}` });
  }
  const updatedProductCategory = await ProductCategory.findById(id);
  res.status(200).json({
    message: "product category updated successfully",
    updatedProductCategory,
  });
});

// deleting a product category
const deleteProductCategory = asyncHandler(async (req, res) => {
  // find the product category by id
  // delete product category from the database
  const { id } = req.params;
  const productCategory = await ProductCategory.findByIdAndDelete(id);
  if (!productCategory) {
    res
      .status(400)
      .json({ error: `cannot find the product category with the id ${id}` });
  }
  res.status(200).json({ message: "product category deleted successfully!" });
});

module.exports = {
  addProductCategory,
  getProductCategory,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
};
