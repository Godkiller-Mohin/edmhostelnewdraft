const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables from .env file
dotenv.config();

// Import routes using CommonJS
const authRoutes = require('./routes/auth.cjs');
const bookingRoomRoute = require('./routes/booking.route.cjs');
const roomRoute = require('./routes/room.route.cjs');
const appRoute = require('./routes/app.route.cjs');
const userRoute = require('./routes/user.routes.cjs');
const eventRoute = require('./routes/events.route.cjs');
const bookingEventroute = require('./routes/bookingevent.route.cjs');

const app = express();

app.use(express.json());

// Configure CORS
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));

// Optional: Add logging middleware
app.use(morgan('dev'));

// Retrieve the port from environment variables or default to 4000
const port = process.env.PORT || 4000;

// Connect to MongoDB using the environment variable for the URI
const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.log('MongoDB connection error:', err);
        });
};

// Define your routes
app.use("/api/app", appRoute);
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoomRoute);
app.use("/api/room", roomRoute);
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);
app.use("/api/bookevent", bookingEventroute);

// Error handling middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connect();
});
