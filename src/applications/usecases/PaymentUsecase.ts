import { PaymentRepository } from "../../respository/PaymentRepository";
import { UserRepository } from "../../respository/UserRespository";

export class PaymentUsecase{
    constructor(
        private paymentRepository:PaymentRepository,
        private userRepository:UserRepository
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
            return { status: 500, message: 'An error occurred during payment plan fetching.' }; 
        }
    }
    async storePaymentDetails(email:string,paymentType:string,amount:number)
    {
        try {

            const data=await this.userRepository.storePaymentDetails(email,paymentType,amount)
            if(!data) return null

            return data
            
        } catch (error) {
            console.log("error in payment data storing",error);
            return { status: 500, message: 'An error occurred during payment data storing.' }; 
        }
    }
    async fetchPaymentStats(startDate: string, endDate: string) {
        try {
          const stats = await this.paymentRepository.fetchPaymentPlans(startDate, endDate);
    
          if (!stats || stats.length === 0) {
            return null;
          }
    
          const currentDate = new Date();
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const firstDayOfLastMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            1
          );
    
          const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
            this.paymentRepository.fetchRevenueByDateRange(firstDayOfMonth),
            this.paymentRepository.fetchRevenueByDateRange(
              firstDayOfLastMonth,
              firstDayOfMonth
            ),
          ]);
    
          const monthlyGrowth =
            lastMonthRevenue > 0
              ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
              : 0;
    
          return {
            totalRevenue: stats[0]?.totalRevenue || 0,
            monthlyGrowth: parseFloat(monthlyGrowth.toFixed(2)),
            activeSubscribers: stats[0]?.activeSubscribers || 0,
          };
        } catch (error) {
          console.error("Error in payment stats use case:", error);
          return { status: 500, message: 'An error occurred during payment data storing.' }; 
        }
      }
}