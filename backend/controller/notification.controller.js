import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const GetNotification =async (req, res) => {
const userId = req.user._id;
try {
    const notification = await Notification.find({to: userId}).populate({
        path:"from",
        select:"userName profileImg"
    })
    await Notification.updateMany({to:userId}, {read:true});
    res.status(200).json(notification)
} catch (error) {
    console.log("error in get notification controller", error)
    res.status(404).json({error:"Internal server error"})
}
}
export const DeleteNotification =async (req, res) => {
    const userId = req.user._id;
    try {
        await Notification.deleteMany({to:userId})
        res.status(200).json({message:"Notification deleted successfully"})
    } catch (error) {
        console.log("error in delete notification controller", error)
    res.status(404).json({error:"Internal server error"})
    }
}