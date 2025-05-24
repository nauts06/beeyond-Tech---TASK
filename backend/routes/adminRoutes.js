// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getAllDeliveryPartners,
  getAllPartners,
} = require('../controllers/adminController');
const {
addProduct
} = require('../controllers/productController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

router.use(protect, authorizeRoles('admin'));


// router.post('/add/products', protect, authorizeRoles('admin'), async (req, res) => {
//   try {
//     const { name, description, price } = req.body;
//      console.log(name, description, price);
    
//     const product = await Product.create({ name, description, price });
//     res.status(201).json({ success: true, product });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Failed to add product' });
//   }
// });

router.post('/add/products', protect, authorizeRoles('admin'),addProduct )

router.get('/orders', getAllOrders);
router.get('/all/partners', getAllDeliveryPartners);
// router.get('/partners', getAllPartners);

module.exports = router;
