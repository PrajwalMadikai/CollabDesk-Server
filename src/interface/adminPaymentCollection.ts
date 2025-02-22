import { Document } from "mongoose";

export interface IAdminPayment extends Document{
    email:string,
    status:string,
    amount:number,
    planType:string,
    purchaseTime:string
}