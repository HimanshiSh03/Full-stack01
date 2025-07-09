const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const userRouter = require('./routes/user.routes');
const taskRoutes = require("./routes/taskRoutes");

// --- UNCOMMENT THIS LINE ---
const cookieParser = require('cookie-parser');
// --- END UNCOMMENT ---

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectToDB = require('./config/db');
connectToDB();

const app = express();

// --- UNCOMMENT THIS LINE ---
// Set view engine (not strictly necessary for a MERN stack if not rendering server-side views)
app.set('view engine', 'ejs');
// --- END UNCOMMENT ---

// Middleware
// --- UNCOMMENT THIS LINE ---
app.use(cookieParser()); // To parse cookies from incoming requests
// --- END UNCOMMENT ---
app.use(express.json()); // To parse JSON bodies from incoming requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

app.use(cors()); // Still using simplified CORS for now

// Routes
app.use('/user', userRouter); // Authentication routes (register, login)
app.use('/api/tasks', taskRoutes); // Task CRUD routes

// A simple test route to confirm the server starts
app.get('/', (req, res) => {
    res.send('Backend is running! (Now with user/task routes, cookieParser, and EJS enabled for testing).');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// --- STILL COMMENTED OUT (DO NOT UNCOMMENT THIS YET) ---
// The specific corsOptions object will be re-added later, after we get the frontend URL
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//     });
// }