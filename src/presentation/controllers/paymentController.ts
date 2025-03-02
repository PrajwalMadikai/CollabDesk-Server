import { NextFunction, Request, Response } from "express";
import { PaymentUsecase } from "../../applications/usecases/PaymentUsecase";

export class PaymentController{

    constructor(
        private paymentUsecase:PaymentUsecase,
        
    ){}

    async addPaymentPlan(req:Request,res:Response,next:NextFunction)
    {
        try {
              const {paymentType,amount,FolderNum,WorkspaceNum}=req.body
              if(!paymentType||!amount||!FolderNum||!WorkspaceNum)
              {
                return res.status(400).json({message:"body params are missing"})
              }
             const data=await this.paymentUsecase.paymentPlan(paymentType,amount,FolderNum,WorkspaceNum)
             if(!data){
                return res.status(404).json({message:"unable to add payment plan"})
             }
          
            
             return res.status(201).json({message:'payment plan added',data})


        } catch (error) {
            next(error)
        }
    }
    async fetchPlans(req:Request,res:Response,next:NextFunction)
    {
        try {
            const data=await this.paymentUsecase.fetchPlans()
            if(!data)
            {
                return res.status(404).json({message:"There is not payment plan"})
            }
            
            return res.status(200).json({message:'Fetched successfully',data})
        } catch (error) {
            next(error)
        }
    }

    async payment(req:Request,res:Response,next:NextFunction)
    {
        try {

            const { userData } = req.body
    
             
             if(!userData)
             {
                return res.status(400).json({message:'Body data are missing'})
             }
             const amount=userData.amount/100
             
             const data=await this.paymentUsecase.storePaymentDetails(userData.email,userData.paymentType,amount)
             if(!data)
             {
                return res.status(404).json({message:"unable to store payment information"})
             }
            
             return res.status(200).json({message:'payment information is stored'   })            
        } catch (error) {
            next(error)
        }
    }

    async paymentStates(req:Request,res:Response,next:NextFunction)
    {
        try {
            const { startDate, endDate } = req.query;
            if(!startDate||!endDate)
            {
                return res.status(400).json({message:"Datas are missing"})
            }
           
            const data=await this.paymentUsecase.fetchPaymentStats(startDate as string,endDate as string)
            if(!data)
            {
                return res.status(404).json({message:"Unable to fetch payment stats"})
            }
            
            return res.status(200).json({message:"successfull",data})
            
        } catch (error) {
            next(error)
        }
    }

    async monthlyPayments(req:Request,res:Response,next:NextFunction)
    {
        try {
            const { startDate, endDate } = req.query;
            if(!startDate||!endDate)
            {
                return res.status(400).json({message:"Datas are missing"})
            }

            const data=await this.paymentUsecase.fetchMonthlyStats(startDate as string,endDate as string)
            if(!data)
            {
                return res.status(404).json({message:"Unable to fetch monthly payment stats"})
            }
            return res.status(200).json({message:"monthly payment fetch successfull",data})

        } catch (error) {
            next(error)
        }
    }

    async planDistribution(req:Request,res:Response,next:NextFunction)
    {
        try {

            const { startDate, endDate } = req.query;
            if(!startDate||!endDate)
            {
                return res.status(400).json({message:"Datas are missing"})
            }

            const data=await this.paymentUsecase.planDistribution(startDate as string,endDate as string)
            if(!data)
            {
                return res.status(404).json({message:"Unable to fetch plan distribution stats"})
            }
            return res.status(200).json({message:"plan distribution fetch successfull",data})
            
        } catch (error) {
            next(error)
        }
    }
    async planDelete(req:Request,res:Response,next:NextFunction)
   {
       try {

           const {type}=req.params

           if(!type)
           {
               return res.status(400).json({message:"type data is missing"})
           }

           const data=await this.paymentUsecase.deletePlan(type)
           if(!data)
           {
              return res.status(404).json({message:"Unable to delete plan"})
           }

           return res.status(200).json({message:"successfully deleted plan"})
           
       } catch (error) {
           next(error)
       }
   }
   
}