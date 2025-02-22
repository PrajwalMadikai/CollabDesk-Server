import { Document } from "mongoose";
import { UserRole } from "./roles";

export interface IUser extends Document{
    fullname:string,
    email:string,
    password:string,
    workSpaces:{ workspaceId: string, workspaceName: string }[];
    paymentDetail:{
        paymentType: string;
        amount:number;
        startDate:Date;
        endDate:Date
    },
    googleId:string,
    avatar:string,
    role:UserRole,
    githubId:string,
    isAdmin:boolean,
    isBlock:boolean
}