// controllers/customerController.js
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const  {productId}  = req.body; // Expecting an array of product IDs

  
    

    if (!productId  || productId.length === 0) {
      return res.status(400).json({ success: false, message: 'No products selected' });
    }

    const products = await Product.find({ _id: { $in: productId } });

      console.log('productId', products);

   

    const order = await Order.create({
      customer: req.user.id,
      products: productId,
      status: 'pending',
    });
  console.log('productId', order);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.id; // comes from protect middleware

    const orders = await Order.find({ customer: customerId })
      .populate('products') // include product details
      .sort({ createdAt: -1 }); // latest orders first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};



// GET /api/customer/orders/:orderId
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('products')
      .populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Make sure the order belongs to the logged-in customer
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

