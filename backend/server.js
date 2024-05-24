import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import MongoDbConnection from './db/DB-Connection.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000

app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    MongoDbConnection();
})