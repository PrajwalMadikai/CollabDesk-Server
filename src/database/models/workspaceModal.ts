import mongoose, { Schema } from "mongoose";
import { IWorkspace } from "../../interface/workspaceInterface";

const workspaceSchema:Schema=new Schema({
    name:{
        type:String
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    userDetails:[{
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        userName:{type:String}
    }],
    directories:[{
        dirId:{type:String},
        dirName:{type:String}
    }],
    meetingRoom:{
        type:String
    },
    type:{
        type:String,
        default:"Private"
    },
    trashId:{
        type:String
    }
})


export const WorkspaceModal=mongoose.model<IWorkspace>("Workspace",workspaceSchema)