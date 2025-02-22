import mongoose, { Schema } from "mongoose";
import { IAdminPayment } from "../../interface/adminPaymentCollection";


const PaymentCollection=new Schema({
    email:{
        type:String
    },
    amount:{
        type:String
    },
    status:{
        type:String,
        enum:['success','failed']
    },
    planType:{
        type:String,
        enum:['base','premium']
    },
    purchaseTime:{
        type:Date,
        default:Date.now()
    }
})

export const PaymentCollectionModal=mongoose.model<IAdminPayment>('paymentCollection',PaymentCollection)