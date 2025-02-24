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
        type:Boolean,
        default:false
    },
    url:{
        type:String,
        default:null
    },
    content:{
        type:String,
        default:null
    },
    coverImage:{
        type:String,
        default:null
    },
    inTrash:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        default:null
    }
})

export const FileModal=mongoose.model<IFile>("File",fileSchema)