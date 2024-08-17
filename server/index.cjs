// server/index.js (or server/index.cjs)
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Import routes using CommonJS
const authRoutes = require('./routes/auth.cjs');
const bookingRoute = require('./routes/booking.route.cjs');
const roomRoute = require('./routes/room.route.cjs');
const appRoute = require('./routes/app.route.cjs');

const app = express();
dotenv.config();

/** Middlewares */
app.use(express.json());
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.use(morgan('dev')); // Optional: Add logging middleware

const port = 8000;

const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://127.0.0.1:27017/')
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.log(err);
        });
};

app.use("/api/app", appRoute);
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoute);
app.use("/api/room", roomRoute);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connect();
});
