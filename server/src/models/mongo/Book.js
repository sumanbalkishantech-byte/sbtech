const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    // NEW: Differentiates between Agency Retail Stock and User Pre-Loved Stock
    book_type: {
        type: String,
        enum: ['New', 'Used'],
        default: 'Used'
    },
    condition: {
        type: String,
        enum: ['New', 'Like_New', 'Good', 'Fair', 'Poor'],
        required: true
    },
    price: {
        type: Number,
        default: null // Null until Admin approves and sets the price
    },
    seller_id: {
        type: String, 
        required: true // Links to the PostgreSQL User ID
    },
    status: {
        type: String,
        enum: ['Pending_Review', 'Approved', 'Rejected', 'Sold'],
        default: 'Pending_Review'
    },
    images: [{
        type: String // Array of file paths from Multer
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Book', bookSchema);