const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
dotenv.config();
// Import routes using CommonJS
const authRoutes = require('./routes/auth.cjs');
const bookingRoomRoute = require('./routes/booking.route.cjs');
const roomRoute = require('./routes/room.route.cjs');
const appRoute = require('./routes/app.route.cjs');
const userRoute = require('./routes/user.routes.cjs');
const eventRoute=require('./routes/events.route.cjs');
const bookingEventroute=require('./routes/bookingevent.route.cjs')
const app = express();

// Load environment variables


// Debug environment variables
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

app.use(express.json());
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.use(morgan('dev')); // Optional: Add logging middleware

const port = 4000;

const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://127.0.0.1:27017/EDM')
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.log(err);
        });
};

app.use("/api/app", appRoute);
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoomRoute);
app.use("/api/room", roomRoute);
app.use("/api/user", userRoute);
app.use("/api/event",eventRoute);
app.use("/api/bookevent",bookingEventroute);

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
