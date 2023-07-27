const Product = require("../model/ProductModel");
const asyncHandler = require("express-async-handler");

// creating an endpoint to add new product

const addProduct = asyncHandler(async (req, res) => {});

// creating a get all product end point

const getProduct = asyncHandler(async (req, res) => {});

// creating a get product by id endpoint

const getProductById = asyncHandler(async (req, res) => {});

// updating product endpoint

const updateProduct = asyncHandler(async (req, res) => {});

// deleting product endpoint

const deleteProduct = asyncHandler(async (req, res) => {});

module.exports = {
  addProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
