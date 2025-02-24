import { Document } from "mongoose";


export interface IDirectory extends Document{
    name:string,
    workspaceId:string,
    files:{fileId:string,fileName:string}[],
    inTrash:boolean,
    deletedAt:Date|null
}