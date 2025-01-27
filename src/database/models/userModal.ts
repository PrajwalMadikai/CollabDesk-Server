import mongoose, { Document, Schema } from "mongoose";


export interface IUser extends Document{
    fullname:string,
    email:string,
    password:string,
    workspace:{ workspaceId: string, workspaceName: string }[];
    paymentDetail:{
        paymentType: string;
        startDate:Date;
        endDate:Date
    },
    googleId:string,
    avatar:string,
    githubId:string
}

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
    }
})

export const UserModal=mongoose.model<IUser>('User',UserSchema)