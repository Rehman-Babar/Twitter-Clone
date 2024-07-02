import express from 'express';
import { protectRoutes } from '../middleware/protectRoutes.js';
import { Profile, followAndUnfollow, getSuggestedUser, updateProfile } from '../controller/user.controller.js';

const router = express.Router();

router.get("/profile/:userName", protectRoutes,Profile )
router.get("/suggested", protectRoutes,getSuggestedUser )
router.post("/follow/:id", protectRoutes,followAndUnfollow )
router.post("/update", protectRoutes, updateProfile)

export default router