import express, { NextFunction, Request, Response } from 'express'
import { WorkspaceUsecase } from '../../applications/usecases/WorkspaceUsecase'
import { UserRole } from '../../interface/roles'
import { UserRepository } from '../../respository/UserRespository'
import { WorkspaceRepository } from '../../respository/WorkspaceRepository'
import { WorkspaceController } from '../controllers/workspaceController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'
import { checkUserBlockStatus } from '../middleware/checkUserBlock'

const router=express.Router()

const workspaceRepository=new WorkspaceRepository()
const userRepository=new UserRepository()

const workspaceUsecase=new WorkspaceUsecase(workspaceRepository,userRepository)
const workspaceController=new WorkspaceController(workspaceUsecase)


router.post('/create',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{workspaceController.newWorkspace(req, res, next)})
router.post('/fetch',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{workspaceController.getUserWorkspace(req, res, next)})

router.post('/add-collaborator',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{workspaceController.addCollaborator(req, res, next)})
router.post('/collaborators',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{workspaceController.fetchCollaborator(req, res, next)})


export default router