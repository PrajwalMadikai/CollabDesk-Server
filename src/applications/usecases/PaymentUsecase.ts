import { PaymentRepository } from "../../respository/PaymentRepository";

export class PaymentUsecase{
    constructor(
        private paymentRepository:PaymentRepository
    ){}

    async paymentPlan(paymentType:string,amount:number,FolderNum:number,WorkspaceNum:number)
    {
        try {
              let data=await this.paymentRepository.addPlan(paymentType,amount,FolderNum,WorkspaceNum)
              if(!data) return null

              return data

        } catch (error) {
            console.log("error in payment add plan",error);
            return { status: 500, message: 'An error occurred during payment plan.' }; 
        }
    }
    async fetchPlans()
    {
        try {

            const data=await this.paymentRepository.fetchPlans()
            if(!data) return null

            return data
            
        } catch (error) {
            console.log("error in payment plan fetching",error);
            return { status: 500, message: 'An error occurred duringpayment plan fetching.' }; 
        }
    }
}