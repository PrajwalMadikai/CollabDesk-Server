import mongoose, { Schema } from "mongoose";
import { IUser } from "../../interface/User";

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
    isAdmin:{
        type:Boolean,
        default:false
    }
})

export const UserModal=mongoose.model<IUser>('User',UserSchema)