const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const connectMongoDB = require('./src/config/mongo');
const db = require('./src/config/postgres');
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for the Next.js frontend
app.use(cors({
  origin: [
    "https://kitabpoint.com", 
    "https://www.kitabpoint.com", 
    "https://sbtech-pi.vercel.app", 
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json());

// Serve the uploads folder publicly so the frontend can load images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', require('./src/routes/orderRoutes'));

// Connect MongoDB
connectMongoDB();

// Quick health-check route
app.get('/api/health', async (req, res) => {
    try {
        // Test PostgreSQL connection
        const pgTime = await db.query('SELECT NOW()');
        res.status(200).json({
            status: 'success',
            message: 'API is running',
            pg_time: pgTime.rows[0].now
        });
    } catch (error) {
        console.error('🚨 Detailed DB Error:', error); // Prints to your VS Code terminal
        res.status(500).json({ error: error.message }); // Shows exact error in the browser
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
