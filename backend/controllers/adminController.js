// controllers/adminController.js
const Order = require('../models/Order');
const User = require('../models/User');

// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('customer', 'name email')
//       .populate('deliveryPartner', 'name email');

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch orders', error });
//   }
// };



// exports.getAllPartners = async (req, res) => {
//   try {
//     const partners = await User.find({ role: 'delivery' })
//     res.json(partners);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch partners', error });
//   }
// };

// GET: All Orders in the system
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('customer deliveryPartner', 'name email role');
  res.json(orders);
};

// GET: All Delivery Partners
exports.getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await User.find({role:'delivery'})
    res.json(partners);

    console.log("partners", partners);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery partners', error });
  }
};
