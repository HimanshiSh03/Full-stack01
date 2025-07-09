const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

// --- UNCOMMENT THESE LINES ---
const userRouter = require('./routes/user.routes');
const taskRoutes = require("./routes/taskRoutes");
// --- END UNCOMMENT ---

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectToDB = require('./config/db');
connectToDB();

const app = express();

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Still using simplified CORS for now

// --- UNCOMMENT THESE LINES ---
// Mount your routes
app.use('/user', userRouter); // Authentication routes (register, login)
app.use('/api/tasks', taskRoutes); // Task CRUD routes
// --- END UNCOMMENT ---

// A simple test route to confirm the server starts
app.get('/', (req, res) => {
    res.send('Backend is running! (Now with user/task routes enabled for testing).');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// --- STILL COMMENTED OUT (DO NOT UNCOMMENT THESE YET) ---
// const cookieParser = require('cookie-parser');
// app.set('view engine', 'ejs');
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//     });
// }
// app.use(cookieParser()); // This will be uncommented later
// const corsOptions = { ... } // Revert to this specific CORS later