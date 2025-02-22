import { PaymentCollectionModal } from "../database/models/paymentCollectionModal";
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
    async fetchPaymentPlans(startDate: string, endDate: string) {
       
          const matchStage = {
            status: 'success',
            ...(startDate && endDate && {
              purchaseTime: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
            }),
          };
    
          const stats = await PaymentCollectionModal.aggregate([
            { $match: matchStage },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: { $toDouble: '$amount' } },
                activeSubscribers: { $sum: 1 },
              },
            },
          ]);
    
          return stats;
         
      }
    
      async fetchRevenueByDateRange(startDate: Date, endDate?: Date) {
         
          const matchStage = {
            status: 'success',
            purchaseTime: {
              $gte: startDate,
              ...(endDate && { $lt: endDate }),
            },
          };
    
          const result = await PaymentCollectionModal.aggregate([
            { $match: matchStage },
            {
              $group: {
                _id: null,
                total: { $sum: { $toDouble: '$amount' } },
              },
            },
          ]);
    
          return result[0]?.total || 0;
        
      }
    
}