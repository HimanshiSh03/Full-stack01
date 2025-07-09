const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors'); // Keep cors imported

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
app.set('view engine', 'ejs');
// --- END UNCOMMENT ---

// Middleware
// --- UNCOMMENT THIS LINE ---
app.use(cookieParser()); // To parse cookies from incoming requests
// --- END UNCOMMENT ---
app.use(express.json()); // To parse JSON bodies from incoming requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// --- KEEPING SIMPLIFIED CORS FOR THIS TEST ---
app.use(cors());
// --- END SIMPLIFIED CORS ---

// Routes
app.use('/user', userRouter); // Authentication routes (register, login)
app.use('/api/tasks', taskRoutes); // Task CRUD routes

// A simple test route to confirm the server starts
app.get('/', (req, res) => {
    res.send('Backend is running! (Testing cookieParser and EJS without specific CORS options).');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// --- THIS BLOCK MUST REMAIN COMMENTED OUT ---
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//     });
// }
// ===========================================