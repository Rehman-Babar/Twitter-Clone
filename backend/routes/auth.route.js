import express from 'express';
import { GetMe, Login, Logout, Signup } from '../controller/auth.controller.js';
import { protectRoutes } from '../middleware/protectRoutes.js';

const router = express.Router();

router.get("/me",protectRoutes, GetMe);
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

export default router