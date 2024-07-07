import jwttokenAndSetCookie from "../lib/utils/generateTokens.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const Signup = async(req, res) => {

    try {
        const {fullName, userName, email, password} = req.body;
       
    if (!fullName || !userName|| !email || !password) {
        return res.status(500).json({error:"please fill all the fields!"})
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {  
        return res.status(400).json({ error: "Invalid email format" });
    };
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    };
    const existedUser = await User.findOne({userName:userName})
    if (existedUser) {
        return res.status(400).json({error:"Username already Taken"})
    }
    const existedEmail = await User.findOne({email:email})
    if (existedEmail) {
        return res.status(400).json({error:"Email already Taken"})
    }
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        userName:userName,
        fullName:fullName,
        email:email,
        password:hashedPassword,
    })
    if(newUser){
        jwttokenAndSetCookie(newUser._id, res);
        await newUser.save();

        return res.status(201).json({
            _id:newUser._id,
            userName:newUser.userName,
            email:newUser.email,
            fullName:newUser.fullName,
            followers:newUser.followers,
            following:newUser.following,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg,
            
        })
    } else{
        return res.status(500).json({error:"Invalid user data"})
    }
    } catch (error) {
        console.log("error in signup controller:", error.message);
        return res.status(500).json({error:"Internal Server Error"})
    }
}

export const Login = async(req, res) => {
    try {
        const {userName, password} = req.body;
        if (!userName || !password) {
            return res.status(500).json({error:"please fill all the fields"})
        };
        const user = await User.findOne({userName})
        if(!user) {
            return res.status(404).json({error:"User not found"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if(!isPasswordCorrect) {
            return res.status(404).json({error:"Invallid password"})
        }
        jwttokenAndSetCookie(user._id, res);
        res.status(201).json({
            _id:user._id,
            userName:user.userName,
            email:user.email,
            fullName:user.fullName,
            followers:user.followers,
            following:user.following,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
            bio:user.bio
        })
    } catch (error) {
        console.log("error in login controller:", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}
export const Logout = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message:"Logged out seccessfully😥😥😥"})
        
    } catch (error) {
        console.log("error in logout controller:", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}
export const GetMe = async(req, res) => {
    
    try {
        const user = await User.findById(req.user?._id).select("-password")
        if (!user) {
            res.status(404).json({error:"User not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        console.log("error in GetMe controller:", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}