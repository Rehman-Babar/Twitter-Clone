import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoutes = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(404).json({error:"Unothorized: No Token Provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            res.status(404).json({error:"Unothorized: Invallid Token"})
        }
        const user = await User.findById(decoded.userId).select("-password")
        req.user = user;
        next();
    } catch (error) {
            console.log("error in protectRoutes middleware:", error.message);
            res.status(500).json({error:"Internal Server Error"})
    }
}