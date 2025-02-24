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
    files:{
      type:[ {
            fileId:String,
            fileName:String
        }],
        default:[]

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

export const FolderModal=mongoose.model<IDirectory>('Directory',directorySchema)