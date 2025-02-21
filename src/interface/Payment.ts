import { Document } from "mongoose";

export interface IPayment extends Document{
    paymentType:string,
    amount:number,
    FolderNum:number,
    WorkspaceNum:number,
}