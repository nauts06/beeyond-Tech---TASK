const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const product = new Product({ name, description, price });
    await product.save();

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
