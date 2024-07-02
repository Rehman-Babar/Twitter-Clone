import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'

import User from "../models/user.model.js";
import Notification from '../models/notification.model.js';
export const Profile = async(req, res) => {
    const {userName} = req.params;
    try {
        const user = await User.findOne({userName}).select("-password")
        if (!user) {
            return res.status(404).json({error:"User not found"})
        }
        res.status(201).json(user)
    } catch (error) {
        console.log("Error in profile controlles", error.message);
        res.status(500).json({error:"internal server Error"})
    }
};

export const getSuggestedUser = async(req, res) => {
    const userId  = req.user._id
    try {
        const userFollowedByYou = await User.findById(req.user._id).select("following")
        const users = await User.aggregate([
            {$match:{
                _id:{$ne : userId }
            }
            },
            {
            $sample:{size : 10}
            }
        ])
        const filteredUser = users.filter((user) => !userFollowedByYou.following.includes(user._id))
        const suggestedUser = filteredUser.slice(0,4)
        suggestedUser.forEach((user) => user.password = null)
        res.status(200).json(suggestedUser)

    } catch (error) {
        console.log("Error in SuggestedUser controlles", error.message);
        res.status(500).json({error:"internal server Error"})
    }
}
export const followAndUnfollow = async(req, res) => {
    const {id} = req.params;
    try {
        const currentUser = await User.findById(req.user._id);
        const userToFollow = await User.findById(id)
        if (!currentUser || !userToFollow) {
            return res.status(404).json({error:"User not found"})
        }
        if(id.toString() === req.user._id.toString()) {
            return res.status(400).json({error: "You cannot follow/unfollow yourself"});
        }
        
        const isFollowing = currentUser.following.includes(id)
        if (isFollowing) {
            await User.findByIdAndUpdate(id, {$pull:{followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull:{following: id}})
            return res.status(201).json({message: `Unfollowed ${userToFollow.fullName} successfully!`});
        } else {
            await User.findByIdAndUpdate(id, {$push:{followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$push:{following : id}})
            const newNotification = new Notification({
                type:"follow",
                from:req.user._id,
                to:userToFollow._id
            })
            await newNotification.save();
            return res.status(201).json({message: `You have successfully followed ${userToFollow.fullName}.`});
        }

    } catch (error) {
        console.log("Error in follow controlles", error.message);
        res.status(500).json({error:"internal server Error"})
    }
}

export const updateProfile = async (req, res) => {
    const { fullName, userName, bio, email, link, currentPassword, newPassword } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both currentPassword & newPassword" });
        }

        if (currentPassword && newPassword) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: "Current Password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(8);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            if (user.profileImg) {
                const publicId = user.profileImg.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResult = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadResult.secure_url;
        }

        if (coverImg) {
            if (user.coverImg) {
                const publicId = user.coverImg.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResult = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadResult.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.userName = userName || user.userName;
        user.bio = bio || user.bio;
        user.email = email || user.email;
        user.link = link || user.link;
        user.coverImg = coverImg || user.coverImg;
        user.profileImg = profileImg || user.profileImg;

        await user.save();
        user.password = null;

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in updateProfile controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};