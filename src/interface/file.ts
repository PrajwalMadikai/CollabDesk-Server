import { Document } from "mongoose";


export interface IFile extends Document{
    name:string,
    directoryId:string,
    published:boolean,
    url:string,
    content:string,
    inTrash:boolean,
    coverImage:string,
    
}