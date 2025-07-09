const express = require('express');
const path = require('path');
const userRouter = require('./routes/user.routes');
const taskRoutes = require("./routes/taskRoutes");

const dotenv = require('dotenv');
const cors = require('cors');
const connectToDB = require('./config/db'); // Assuming this file exists and connects to MongoDB
const cookieParser = require('cookie-parser');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectToDB();

const app = express();

// Set view engine (not strictly necessary for a MERN stack if not rendering server-side views)
app.set('view engine', 'ejs');

// Middleware
app.use(cookieParser()); // To parse cookies from incoming requests
app.use(express.json()); // To parse JSON bodies from incoming requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// CORS Configuration
// Frontend is at http://localhost:5173, Backend is at http://localhost:3000
const corsOptions = {
    origin: "http://localhost:5173", // <--- CORRECTED: This matches your frontend's exact URL
    credentials: true, // Allows sending and receiving cookies (important for auth)
};
app.use(cors(corsOptions));


// Routes
app.use('/user', userRouter); // Authentication routes (register, login)
app.use('/api/tasks', taskRoutes); // Task CRUD routes

console.log('Connecting to:', process.env.MONGO_URI || 'MONGODB_URI not set in .env'); // Added a fallback message

// Serve frontend in production (this block is for deployment, typically not active in development)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
    });
}

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});