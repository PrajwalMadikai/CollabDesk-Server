import { PaymentEntity } from "../entities/paymentEntity";

export interface PaymentInterface{
    addPlan(paymentType:string,amount:number,FolderNum:number,WorkspaceNum:number):Promise<PaymentEntity|null>
    
    fetchPlans():Promise<PaymentEntity[]|null>

    fetchPaymentPlans(startDate: string, endDate: string): Promise<any>;  
    fetchRevenueByDateRange(startDate: Date, endDate?: Date): Promise<number>
    fetchMonthlyStats(startDate:string,endDate:string):Promise<any>
    fetchPlanDistribution(startDate:string,endDate:string):Promise<any>
}