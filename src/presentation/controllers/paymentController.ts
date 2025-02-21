import { NextFunction, Request, Response } from "express";
import { PaymentUsecase } from "../../applications/usecases/PaymentUsecase";

export class PaymentController{
    constructor(
        private paymentUsecase:PaymentUsecase
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
            console.log('fetch:',data);
            
            return res.status(200).json({message:'Fetched successfully',data})
        } catch (error) {
            next(error)
        }
    }
}