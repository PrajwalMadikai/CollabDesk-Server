import express, { NextFunction, Request, Response } from 'express'
import { WorkspaceUsecase } from '../../applications/usecases/WorkspaceUsecase'
import { WorkspaceRepository } from '../../respository/WorkspaceRepository'
import { WorkspaceController } from '../controllers/workspaceController'
import { authenticateToken } from '../middleware/authMiddleware'
const router=express.Router()

const workspaceRepository=new WorkspaceRepository()


const workspaceUsecase=new WorkspaceUsecase(workspaceRepository)

const workspaceController=new WorkspaceController(workspaceUsecase)


router.post('/create',authenticateToken,async(req:Request,res:Response,next:NextFunction)=>{
    await workspaceController.newWorkspace(req, res, next);
})


export default router