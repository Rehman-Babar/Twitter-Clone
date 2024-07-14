import User from "../models/user.model.js";
import Post from '../models/post.model.js'
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
export const CreatePost = async(req, res) => {
    const {text} = req.body;
    let {img} = req.body;
    const userId = req.user._id.toString();
    try {
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({error:"User not found"});
        if( !text && !img ) return res.status(400).json({error:"Post must have a text or image"});
        if (img) {
            const uplodedResponce = await cloudinary.uploader.upload(img);
            img = uplodedResponce.secure_url;
        }
        const newPost =new Post({
            user:userId,
            img,
            text
        })
        await newPost.save();
        res.status(201).json(newPost)
    } catch (error) {
        console.log("Error in createPost controller", error);
        return res.status(500).json({error:error.message})
    }
}
export const DeletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({error:"Post not found"})
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"you are not authorized to delete this post."})
        }
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }
        await Post.findByIdAndDelete(req.params.id);
        return res.status(201).json({message:"Post deleted successfully"})
    } catch (error) {
        res.status(201).json({error:"Internal server error"});
        console.log("Error in delete controller", error)
    }
}
export const LikeUnlikePost = async(req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;
        
        // const user = await User.findById(userId)
        // if (!user) {
        //     res.status(400).json({error:"user not found"})
        // }
        const post = await Post.findById(postId)
        if (!post) {
            res.status(400).json({error:"post not found"})
        }
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            // unlike the post
            await Post.updateOne({_id:postId}, {$pull:{likes:userId}})
            await User.updateOne({_id:userId}, {$pull:{likedPosts:postId}})
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString())
            res.status(201).json(updatedLikes)
        } else {
            // like the post
            post.likes.push(userId)
            // user.likedPosts.push(postId)
            await User.updateOne({_id:userId}, {$push:{likedPosts:postId}})
            await post.save();

            const notification = new Notification({
                from:userId,
                to:post.user,
                type:"like"
            })
            await notification.save();
            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes)
        }

    } catch (error) {
        res.status(201).json({error:"Internal server error"});
        console.log("Error in like controller", error)
    }
}
export const CommentPost = async(req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }
        const comment = { user: userId, text };
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }
        post.comments.push(comment);
        
        await post.populate({
            path:"comments.user",
            select:"-password"
        })
        await post.save();
        res.status(201).json(post.comments[post.comments.length - 1]); // Return the newly created comment with populated user details
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in commentOnPost controller", error);
    }
};


export const GetAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt : -1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        })
        if(posts.length === 0) {
            return res.status(200).json([])
        }
        return res.status(200).json(posts)
    } catch (error) {
        res.status(201).json({error:"Internal server error"});
        console.log("Error in allPosts controller", error)
    }
}

export const GetAllLikes =async (req, res) => {
try {
    const userId = req.params.id;
    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({error:"user not found"})
    }
    const likedPosts = await Post.find({_id : {$in:user.likedPosts}})
    .populate({
        path:"user",
        select:"-password"
    })
    .populate({
        path:"comments.user",
        select:"-password"
    })
    res.status(200).json(likedPosts)
} catch (error) {
    res.status(201).json({error:"Internal server error"});
    console.log("Error in GetAllLikes controller", error)
}
}

export const GetFollowingPosts = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({error:"User not found"})
        }
        // const myFollowingUsers = await User.find({_id : {$in:user.following}}) /////// WRONG
        const following = user.following;
        const feedPosts = await Post.find({user: {$in:following}})
        .sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        })
        res.status(200).json(feedPosts)
    } catch (error) {
        res.status(201).json({error:"Internal server error"});
        console.log("Error in GetFollowingPosts controller", error)
    }
}

export const GetUsersPosts = async (req, res) => {
    const {userName} = req.params;
    try {
        const user = await User.findOne({userName});
        if(!user) {
            return res.status(404).json({error:"User not found"})
        }
        const posts = await Post.find({user: user._id}).sort({createdAt : -1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        })
        res.status(200).json(posts)
    } catch (error) {
        res.status(201).json({error:"Internal server error"});
        console.log("Error in GetUsersPosts controller", error)
    }
}