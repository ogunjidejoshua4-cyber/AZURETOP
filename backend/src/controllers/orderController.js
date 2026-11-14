const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order with server-side price validation
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // SERVER-SIDE PRICE VALIDATION & STOCK CHECK
    let calculatedTotalPrice = 0;
    const validatedOrderItems = [];

    for (const item of orderItems) {
      const productFromDb = await Product.findById(item.product);

      if (!productFromDb) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (productFromDb.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${productFromDb.name}. Only ${productFromDb.stock} left.`,
        });
      }

      // Use the true price from MongoDB, NOT the price sent from the browser
      const itemTotalPrice = productFromDb.price * item.quantity;
      calculatedTotalPrice += itemTotalPrice;

      validatedOrderItems.push({
        product: productFromDb._id,
        name: productFromDb.name,
        quantity: item.quantity,
        price: productFromDb.price, // Trusted database price
        image: productFromDb.images && productFromDb.images.length > 0 ? productFromDb.images[0].url : '',
      });

      // Decrease product stock
      productFromDb.stock -= item.quantity;
      await productFromDb.save();
    }

    // Create the order
    const order = new Order({
      user: req.user._id,
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Card',
      totalPrice: calculatedTotalPrice,
      isPaid: true, // For now, we simulate successful payment; can integrate Paystack/Flutterwave later
      paidAt: Date.now(),
      orderStatus: 'Pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user is either the owner of the order or an admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};