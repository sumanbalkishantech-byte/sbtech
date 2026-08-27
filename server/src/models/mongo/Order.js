const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // Links to Postgres User
    items: [{
        _id: String,
        title: String,
        price: Number,
        image: String,
        book_type: String
    }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    shippingAddress: { type: Object, required: true },
    status: { type: String, default: 'Processing' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);