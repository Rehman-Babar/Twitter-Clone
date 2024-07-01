import express from 'express'
import { protectRoutes } from '../middleware/protectRoutes.js';
import { CommentPost, CreatePost, DeletePost, GetAllLikes, GetAllPosts, GetFollowingPosts, GetUsersPosts, LikeUnlikePost } from '../controller/post.controller.js';

const router = express.Router();

router.get("/all", protectRoutes, GetAllPosts)
router.get("/getLikes/:id", protectRoutes, GetAllLikes) 
router.get("/following", protectRoutes, GetFollowingPosts) 
router.get("/getPosts/:userName", protectRoutes, GetUsersPosts) 
router.post("/create", protectRoutes, CreatePost)
router.post("/like/:id", protectRoutes, LikeUnlikePost)
router.post("/comment/:id", protectRoutes, CommentPost)
router.delete("/:id", protectRoutes, DeletePost)

export default router