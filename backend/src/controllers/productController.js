const Product = require('../models/Product');

// @desc    Get all products with optional search and category filtering
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 10; // Number of products per page
    const page = Number(req.query.page) || 1;

    // Build query filters
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i', // Case-insensitive search
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const filter = { ...keyword, ...category };

    // Count total products matching filter for pagination
    const count = await Product.countDocuments(filter);

    // Fetch products with pagination and populate category details
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 }); // Newest products first

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name slug'
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stock, isFeatured } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      images: images || [], // Array of { url, public_id } from Cloudinary
      stock,
      isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stock, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.category = category || product.category;
      product.images = images || product.images;
      product.stock = stock !== undefined ? stock : product.stock;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};