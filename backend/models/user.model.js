import express from 'express';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLenght:6
    },
    profileImg:{
        type:String,
        default:""
    },
    coverImg:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    },
    likedPosts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            default:[]
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
},{timestamps:true});

const User = mongoose.model("User", userSchema)

export default User;