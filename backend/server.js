import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary'
import cors from 'cors'

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.routes.js';
import notificationRoutes from './routes/notification.route.js';

import MongoDbConnection from './db/DB-Connection.js';

dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_cloude_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const port = process.env.PORT || 5000

const app = express();

app.use(express.json({limit:"3mb"}))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"*"
}))


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notification", notificationRoutes);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    MongoDbConnection();
})