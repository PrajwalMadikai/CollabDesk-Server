import mongoose, { Schema } from "mongoose";
import { IUser } from "../../interface/User";
import { UserRole } from "../../interface/roles";

const UserSchema:Schema=new Schema({
    email:{
        type:String
    },
    fullname:{
        type:String
    },
    password:{
        type:String
    },
    paymentDetail:{
        paymentType: String,
        amount:Number,
        startDate:Date,
        endDate:Date
    },
    workSpaces: [  
        {
            workspaceId: String,
            workspaceName: String,
        },
    ],
    googleId:{
        type:String
    },
    avatar:{
        type:String,
    },
    githubId:{
        type:String
    },
    role:{
        type:String,
        enum:Object.values(UserRole),
        default:UserRole.USER
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBlock:{
        type:Boolean,
        default:false
    }
})

export const UserModal=mongoose.model<IUser>('User',UserSchema)