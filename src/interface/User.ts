import { Document } from "mongoose";


export interface IUser extends Document{
    fullname:string,
    email:string,
    password:string,
    workSpaces:{ workspaceId: string, workspaceName: string }[];
    paymentDetail:{
        paymentType: string;
        startDate:Date;
        endDate:Date
    },
    googleId:string,
    avatar:string,
    githubId:string,
    isAdmin:boolean
}