const Order = require('../models/mongo/Order');
const Book = require('../models/mongo/Book');

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, shippingAddress } = req.body;

        // 1. Save the order
        const order = await Order.create({
            user_id: req.user.id,
            items,
            totalAmount,
            paymentMethod,
            shippingAddress
        });

        // 2. Mark the purchased books as 'Sold' so they disappear from the catalog
        const bookIds = items.map(item => item._id);
        await Book.updateMany({ _id: { $in: bookIds } }, { status: 'Sold' });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process order' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // Returns the updated document
        );
        
        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };