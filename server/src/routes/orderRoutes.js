const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

// We just needed to add 'adminOnly' to this import line!
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/admin/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;