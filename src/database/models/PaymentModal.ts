import mongoose, { Schema } from "mongoose";
import { IPayment } from "../../interface/Payment";

const paymentSchema=new Schema({
    paymentType:{
        type:String,
        enum:['base','premium']
    },
    amount:{
        type:Number
    },
    FolderNum:{
        type:Number
    },
    WorkspaceNum:{
        type:Number
    }
})

export const paymentModal=mongoose.model<IPayment>("Payment",paymentSchema)