// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, placeOrder, getMyOrders, getOrderById } = require('../controllers/customerController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public: View products
router.get('/products', getProducts);

// Protected: Place order (only for customers)
router.post('/orders', protect, authorizeRoles('customer'), placeOrder);

router.get('/get/orders', protect, authorizeRoles('customer'), getMyOrders);

router.get('/orders/:orderId', protect, authorizeRoles('customer'), getOrderById);

module.exports = router;
