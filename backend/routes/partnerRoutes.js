const express = require('express');
const router = express.Router();
const {
  getAvailableOrders,
  acceptOrder,
  updateOrderStatus
} = require('../controllers/partnerController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect, authorizeRoles('delivery'));

router.get('/orders', getAvailableOrders);
router.put('/orders/:orderId/accept', acceptOrder);
router.put('/orders/:orderId/status', updateOrderStatus);

module.exports = router;
