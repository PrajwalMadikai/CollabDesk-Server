import express, { NextFunction, Request, Response } from 'express'
import { FileUsecase } from '../../applications/usecases/FileUsecase'
import { UserRole } from '../../interface/roles'
import { FileRepository } from '../../respository/fileRepository'
import { FileController } from '../controllers/fileController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'
import { checkUserBlockStatus } from '../middleware/checkUserBlock'

const router=express.Router()

const fileRepository=new FileRepository()

const fileUsecase=new FileUsecase(fileRepository)

const fileController=new FileController(fileUsecase)

router.post('/create',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{fileController.createFiles(req, res, next)})
router.post('/delete/:fileId',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{fileController.deleteFile(req, res, next)})


export default router