const Product = require("../model/ProductModel");
const asyncHandler = require("express-async-handler");

// creating an endpoint to add new product

const addProduct = asyncHandler(async (req, res) => {
  //collect the payload
  //check if product already exists
  //save product to the database

  const { name, price, rating, image, description, category_id } = req.body;
  if (!name || !price || !rating || !image || !description) {
    res.status(400).json({ error: "all fields are mandatory" });
  }
  const availableProduct = await Product.findOne({ name });
  if (availableProduct) {
    res.status(400).json({ error: "Product already exists " });
  }

  const product = await Product.create({
    name,
    price,
    rating,
    image,
    description,
    category_id,
  });
  res.status(200).json({
    message: "product created successfully",
    product,
  });
});

// creating a get all product end point

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.find();

  if (!product) {
    return res.status(400).json({ error: "cannot fetch all products" });
  }
  res.status(200).json({
    data: product,
    message: "all products gotten successfully!",
  });
});

// creating a get product by id endpoint

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res
      .status(400)
      .json({ error: `cannot find the product with the id ${id}` });
  }
  res.status(200).json({
    data: product,
    message: "product gotten succcessfully!",
  });
});

// updating product endpoint

const updateProduct = asyncHandler(async (req, res) => {
  // collect the payload
  //check if the product exist in the database
  // update the product

  const { id } = req.params;
  const { name, rating, price, image, description } = req.body;
  if (!name || !rating || !price || !image || !description) {
    return res.status(400).json({ error: "all fields are mandantory" });
  }

  const product = await Product.findByIdAndUpdate(id, req.body);
  if (!product) {
    return res
      .status(400)
      .json({ error: `cannot find the product with the id ${id}` });
  }
  const updatedProduct = await Product.findById(id);
  res.status(200).json({
    data: updatedProduct,
    message: "product updated successfully",
  });
});

// deleting product endpoint

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res
      .status(400)
      .json({ error: `cannot find the product with the id ${id}` });
  }
  res.status(200).json({
    message: "product deleted successfully",
  });
});

module.exports = {
  addProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
