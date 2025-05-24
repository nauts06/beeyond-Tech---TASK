const Order = require('../models/Order');

exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { deliveryPartner: { $exists: false } },
        { deliveryPartner: null },
        { deliveryPartner: req.user._id }
      ]
    })
    .populate('customer')
    .populate('products.product');

    // console.log("Found orders:", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching available orders:", error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};



exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    // console.log("partenr accept" , order);   
    

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.deliveryPartner && order.deliveryPartner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Order already assigned to another partner' });
    }

    order.deliveryPartner = req.user._id;
    order.status = 'accepted';
    await order.save();

    res.json({ message: 'Order accepted', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept order', error });
  }
};


exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // console.log("statusstatus", status);
  

  try {
    const order = await Order.findById(req.params.orderId);
 console.log("statusstatus", order);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.deliveryPartner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.status = status;
    await order.save();
    
    const io = req.app.get('io');
    io.to(orderId).emit('orderStatusUpdated', order);

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error });
  }
};
