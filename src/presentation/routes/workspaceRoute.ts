import express, { NextFunction, Request, Response } from 'express'
import { WorkspaceUsecase } from '../../applications/usecases/WorkspaceUsecase'
import { UserRepository } from '../../respository/UserRespository'
import { WorkspaceRepository } from '../../respository/WorkspaceRepository'
import { WorkspaceController } from '../controllers/workspaceController'
import { authenticateToken } from '../middleware/authMiddleware'

const router=express.Router()

const workspaceRepository=new WorkspaceRepository()
const userRepository=new UserRepository()

const workspaceUsecase=new WorkspaceUsecase(workspaceRepository,userRepository)
const workspaceController=new WorkspaceController(workspaceUsecase)


router.post('/create',authenticateToken,(req:Request,res:Response,next:NextFunction)=>{workspaceController.newWorkspace(req, res, next)})


export default router