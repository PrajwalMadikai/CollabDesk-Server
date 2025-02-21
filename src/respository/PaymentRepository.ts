import { paymentModal } from "../database/models/PaymentModal";
import { PaymentEntity } from "../entities/paymentEntity";
import { PaymentInterface } from "../Repository-Interfaces/IPayment";

export class PaymentRepository implements PaymentInterface{
    
    async addPlan(paymentType: string, amount: number, FolderNum: number, WorkspaceNum: number): Promise<PaymentEntity | null> {

        const isExist=await paymentModal.findOne({paymentType})
        if(isExist) return null

        const plan=await paymentModal.create({paymentType,amount,FolderNum,WorkspaceNum})
        if(!plan) return null
        
        return new PaymentEntity(
            plan.id,
            plan.paymentType,
            plan.amount,
            plan.FolderNum,
            plan.WorkspaceNum
        )
    }

    async fetchPlans():Promise<PaymentEntity[]|null>{

        const plan=await paymentModal.find()
        if(!plan) return null
        
        return plan.map((plan)=>new PaymentEntity(
            plan.id,
            plan.paymentType,
            plan.amount,
            plan.FolderNum,
            plan.WorkspaceNum
        ))
    }
}