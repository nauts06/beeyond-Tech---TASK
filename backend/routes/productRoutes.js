// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// router.use(protect, authorizeRoles('admin'));



router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    // console.log("products", products);
    
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});







module.exports = router;
