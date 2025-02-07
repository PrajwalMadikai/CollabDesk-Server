import mongoose, { Schema } from "mongoose";
import { IFile } from "../../interface/file";

const fileSchema:Schema=new Schema({
    name:{
        type:String
    },
    directoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Directory'
    },
    published:{
        type:Boolean
    },
    url:{
        type:String
    },
    content:{
        type:String
    },
    coverImage:{
        type:String
    },
    inTrash:{
        type:Boolean,
        default:false
    }
})

export const FileModal=mongoose.model<IFile>("File",fileSchema)