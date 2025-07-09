const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const userRouter = require('./routes/user.routes');
const taskRoutes = require("./routes/taskRoutes");
const cookieParser = require('cookie-parser');


// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectToDB = require('./config/db');
connectToDB();

const app = express();


app.set('view engine', 'ejs');


app.use(cookieParser()); // To parse cookies from incoming requests
app.use(express.json()); // To parse JSON bodies from incoming requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// --- RE-INTRODUCING FULL CORS CONFIGURATION ---
const corsOptions = {
    origin: process.env.CORS_ORIGIN ||'https://frabjous-entremet-4e7e89.netlify.app', // Will be set in Render environment variables
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Explicitly define allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly define allowed headers
};
app.use(cors(corsOptions));
// --- END FULL CORS CONFIGURATION ---

// Routes
app.use('/user', userRouter); // Authentication routes (register, login)
app.use('/api/tasks', taskRoutes); // Task CRUD routes

// A simple test route to confirm the server starts
app.get('/', (req, res) => {
    res.send('Backend is running! (Full configuration, ready for frontend).');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// --- THIS BLOCK MUST REMAIN COMMENTED OUT (for separate frontend deployment) ---
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//     });
// }
// ===========================================