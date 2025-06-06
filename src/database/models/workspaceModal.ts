import mongoose, { Schema } from "mongoose";
import { IWorkspace } from "../../interface/workspaceInterface";

const workspaceSchema:Schema=new Schema({
    name:{
        type:String
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    userDetails: {
        type: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, userEmail: { type: String } }],
        default: []
    },
    directories: {
        type: [{ dirId: { type: String }, dirName: { type: String } }],
        default: []
    },
    activity:{
        type:[{email:{type:String},action:{type:String},time:{type:Date}}],
        default:[]
    }     
})


export const WorkspaceModal=mongoose.model<IWorkspace>("Workspace",workspaceSchema)