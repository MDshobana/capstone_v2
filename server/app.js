
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import protectedRoutes from './routes/protectedRoutes.js';


const app = express();
app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://capstone-v2-indol.vercel.app"],

    credentials: true
}));

app.use(bodyParser.json());

mongoose.connect(process.env.connection || [], {
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
})

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);


app.use("/uploads", express.static("uploads"));
// app.use('/api/protected', (req, res, next) => {
//     console.log("✅ Protected route hit:", req.url);
//     next();
// }, protectedRoutes);
export default app;
