import { Document } from "mongoose";

export interface IWorkspace extends Document{
    name:string,
    ownerId:string,
    directories:{Did:string,Dname:string}[],
    userDetails:{uId:string,email:string}[],
    meetingRoom:string,
    type:string,
    trashId:string|null
}