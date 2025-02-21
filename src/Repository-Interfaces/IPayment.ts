import { PaymentEntity } from "../entities/paymentEntity";

export interface PaymentInterface{
    addPlan(paymentType:string,amount:number,FolderNum:number,WorkspaceNum:number):Promise<PaymentEntity|null>
    
    fetchPlans():Promise<PaymentEntity[]|null>
}