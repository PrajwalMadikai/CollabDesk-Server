import express, { NextFunction, Request, Response } from 'express'
import { DirectoryUsecase } from '../../applications/usecases/DirectoryUsecase'
import { UserRole } from '../../interface/roles'
import { DirectoryRepository } from '../../respository/DirectoryRepository'
import { DirectoryController } from '../controllers/directoryController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'
import { checkUserBlockStatus } from '../middleware/checkUserBlock'

const router=express.Router()

const directoryRepository=new DirectoryRepository()


const directoryUsecase=new DirectoryUsecase(directoryRepository)


const directoryController=new DirectoryController(directoryUsecase)

 

router.post('/create',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>directoryController.createFolder(req,res,next))

router.put('/update/:folderId',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>directoryController.updateFolder(req,res,next))

router.post('/fetch',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>directoryController.fetchFolder(req,res,next))
 
router.post('/move-to-trash',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>directoryController.movetoTrash(req,res,next))

router.post('/restore',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>directoryController.restoreFolder(req,res,next))

//trash folder and file fetch
router.post('/trash-fetch',authenticateToken,checkUserBlockStatus,authorizeRoles(UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>directoryController.fetchTrashItems(req,res,next))


export default router