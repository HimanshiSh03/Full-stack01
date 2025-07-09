const express = require('express');
const path = require('path'); // Keep path for now, but not actively used
const dotenv = require('dotenv');
const cors = require('cors'); // Keep cors, but its options might be simplified

// Load environment variables
dotenv.config();

// Connect to MongoDB (we'll keep this as it's critical, but if this causes issues, we can comment it out too)
const connectToDB = require('./config/db');
connectToDB();

const app = express();

// Basic Middleware (keep these as they are standard)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic CORS to allow testing from anywhere for now
app.use(cors()); // Simplified CORS just for testing startup

// A simple test route to confirm the server starts
app.get('/', (req, res) => {
    res.send('Backend is running! If you see this, the core Express app started.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// --- EVERYTHING ELSE COMMENTED OUT FOR TESTING ---
// const userRouter = require('./routes/user.routes');
// const taskRoutes = require("./routes/taskRoutes");
// const cookieParser = require('cookie-parser');
// app.set('view engine', 'ejs');
// app.use(cookieParser());
// app.use('/user', userRouter);
// app.use('/api/tasks', taskRoutes);
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//     });
// }