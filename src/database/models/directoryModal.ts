import mongoose, { Schema } from "mongoose";
import { IDirectory } from "../../interface/directory";

const directorySchema:Schema=new Schema({
    name:{
        type:String
    },
    workspaceId:{
         type: mongoose.Schema.Types.ObjectId,
          ref: "Workspace"
    },
    files:[
        {
            fileId:String,
            fileName:String
        }
    ],
    inTrash:{
        type:Boolean,
        default:false
    }
})

export const FolderModal=mongoose.model<IDirectory>('Directory',directorySchema)