const Book = require('../models/mongo/Book');

// @desc    Get all approved books (Public Storefront)
// @route   GET /api/books
const getApprovedBooks = async (req, res) => {
    try {
        const books = await Book.find({ status: 'Approved' }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: error.message || 'Server error fetching books' });
    }
};

// @desc    User or Admin uploads a book (Protected Route)
// @route   POST /api/books/upload
const uploadUsedBook = async (req, res) => {
    try {
        // Now accepting book_type from the frontend to handle both New and Used inventory
        const { title, author, description, condition, book_type } = req.body;

        // Extract file paths from Multer's req.files array (if images were uploaded)
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const newBook = await Book.create({
            title,
            author,
            description,
            // If no book_type is provided from the frontend, default to 'Used' for normal users
            book_type: book_type || 'Used',
            // If it's a Brand New book, automatically set condition to 'New', otherwise use provided condition
            condition: book_type === 'New' ? 'New' : condition,
            seller_id: req.user.id,
            status: 'Pending_Review',
            images: imagePaths, // Save the generated file paths to MongoDB
        });

        res.status(201).json({
            message: 'Book submitted successfully. Pending admin approval.',
            book: newBook
        });
    } catch (error) {
        console.error('Error uploading book:', error);
        res.status(500).json({ error: error.message || 'Server error uploading book' }); 
    }
};

// @desc    Get all pending books (Protected Super Admin Route)
// @route   GET /api/books/admin/pending
const getPendingBooks = async (req, res) => {
    try {
        const books = await Book.find({ status: 'Pending_Review' }).sort({ createdAt: 1 });
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching pending books:', error);
        res.status(500).json({ error: error.message || 'Server error fetching pending books' });
    }
};

// @desc    Admin approves/rejects a book and sets the price (Protected Super Admin Route)
// @route   PUT /api/books/admin/review/:id
const reviewBook = async (req, res) => {
    try {
        const { status, price } = req.body;

        if (status === 'Approved' && !price) {
            return res.status(400).json({ error: 'An approved book must have a selling price.' });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { status, price },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.status(200).json({
            message: `Book successfully ${status.toLowerCase()}`,
            book: updatedBook
        });
    } catch (error) {
        console.error('Error reviewing book:', error);
        res.status(500).json({ error: error.message || 'Server error reviewing book' });
    }
};

// @desc    Get logged-in user's uploaded books (Protected User Route)
// @route   GET /api/books/mybooks
const getMyBooks = async (req, res) => {
    try {
        // Fetch only books where the seller_id matches the logged-in user's ID
        const books = await Book.find({ seller_id: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching user books:', error);
        res.status(500).json({ error: error.message || 'Server error fetching your books' });
    }
};

// @desc    Get a single approved book by ID
// @route   GET /api/books/:id
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        // Ensure the book exists and is actually approved for the public storefront
        if (!book || book.status !== 'Approved') {
            return res.status(404).json({ error: 'Book not found or not available.' });
        }
        
        res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching single book:', error);
        res.status(500).json({ error: 'Server error fetching book details' });
    }
};

module.exports = { getApprovedBooks, uploadUsedBook, getPendingBooks, reviewBook, getMyBooks, getBookById };