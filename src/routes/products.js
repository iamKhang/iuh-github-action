const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get all products
router.get('/', (req, res) => {
  const products = Product.getAll();
  res.render('products/index', { products });
});

// Display form to add a new product
router.get('/new', (req, res) => {
  res.render('products/new');
});

// Create a new product
router.post('/', (req, res) => {
  const { name, price, description } = req.body;
  Product.create({ name, price, description });
  res.redirect('/products');
});

// Display a specific product
router.get('/:id', (req, res) => {
  const product = Product.getById(req.params.id);
  if (!product) {
    return res.status(404).render('error', { message: 'Product not found' });
  }
  res.render('products/show', { product });
});

// Display form to edit a product
router.get('/:id/edit', (req, res) => {
  const product = Product.getById(req.params.id);
  if (!product) {
    return res.status(404).render('error', { message: 'Product not found' });
  }
  res.render('products/edit', { product });
});

// Update a product
router.post('/:id', (req, res) => {
  const { name, price, description } = req.body;
  Product.update(req.params.id, { name, price, description });
  res.redirect('/products');
});

// Delete a product
router.post('/:id/delete', (req, res) => {
  Product.delete(req.params.id);
  res.redirect('/products');
});

module.exports = router;
