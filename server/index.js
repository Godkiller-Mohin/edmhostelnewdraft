import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

//routes
import authRoutes from './routes/auth.js';
import bookingroute from './routes/booking.route.js'
import roomRoute from './routes/room.route.js'
import appRoute from './routes/app.route.js'
const app = express();
dotenv.config();

/** Middlewares */
app.use(express.json());
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));


const port = 8000;

const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://127.0.0.1:27017/').then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {
        console.log(err);
    });
};


app.use(express.json())

app.use("/api/app",appRoute)
app.use("/api/auth", authRoutes)
app.use("/api/booking",bookingroute)
app.use("/api/room",roomRoute)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(port, () => {
    console.log("Connected")
    connect();
})
