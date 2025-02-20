import express, { NextFunction, Request, Response } from 'express'
import { MulterService } from '../../applications/services/MulterService'
import { FileUsecase } from '../../applications/usecases/FileUsecase'
import { UserRole } from '../../interface/roles'
import { FileRepository } from '../../respository/fileRepository'
import { FileController } from '../controllers/fileController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'
import { checkUserBlockStatus } from '../middleware/checkUserBlock'

const router=express.Router()

const fileRepository=new FileRepository()
const multerService=new MulterService()
const fileUsecase=new FileUsecase(fileRepository)

const fileController=new FileController(fileUsecase)

router.post('/create',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{fileController.createFiles(req, res, next)})
router.post('/delete/:fileId',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{fileController.deleteFile(req, res, next)})

router.post('/fetch',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{fileController.fetchFile(req, res, next)})

router.get('/:fileId',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{fileController.contentFetch(req, res, next)})

router.put('/update/:fileId',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),(req:Request,res:Response,next:NextFunction)=>{fileController.updateFileName(req, res, next)})

router.put('/uploadImage/:fileId',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),multerService.single("image"),(req:Request,res:Response,next:NextFunction)=>{fileController.uploadImage(req, res, next)})

 
export default router