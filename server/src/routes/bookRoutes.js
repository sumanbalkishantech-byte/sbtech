const express = require('express');
const router = express.Router();

// Import the controller functions
const {
    getApprovedBooks,
    uploadUsedBook,
    getPendingBooks,
    reviewBook,
    getMyBooks,
    getBookById
} = require('../controllers/bookController');

// Import your authentication middleware
const { protect, adminOnly } = require('../middleware/authMiddleware'); 
const upload = require('../middleware/uploadMiddleware'); 

// ==========================================
// 1. PUBLIC ROUTES (Static)
// ==========================================
router.get('/', getApprovedBooks);


// ==========================================
// 2. PROTECTED USER ROUTES (Requires Login)
// ==========================================
router.post('/upload', protect, upload.array('images', 5), uploadUsedBook);
router.get('/mybooks', protect, getMyBooks);


// ==========================================
// 3. PROTECTED SUPER ADMIN ROUTES
// ==========================================
router.get('/admin/pending', protect, adminOnly, getPendingBooks);
router.put('/admin/review/:id', protect, adminOnly, reviewBook);


// ==========================================
// 4. DYNAMIC ROUTES (Must be at the absolute bottom!)
// ==========================================
// @route   GET /api/books/:id
// @desc    Get a single approved book by ID
router.get('/:id', getBookById);

module.exports = router;