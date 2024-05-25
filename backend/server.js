import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import MongoDbConnection from './db/DB-Connection.js';


dotenv.config();

const port = process.env.PORT || 5000

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))


app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    MongoDbConnection();
})