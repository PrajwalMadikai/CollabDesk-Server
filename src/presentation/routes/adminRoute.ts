import express, { NextFunction, Request, Response } from 'express'
import { TokenService } from '../../applications/services/TokenService'
import { BcryptService } from '../../applications/services/bcryptService'
import { AdminUsecase } from '../../applications/usecases/AdminUsecase'
import { UserRole } from '../../interface/roles'
import { UserRepository } from '../../respository/UserRespository'
import { AdminController } from '../controllers/adminController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'

const router=express.Router()

const userRepository=new UserRepository()

const tokenService=new TokenService()
const bcryptService=new BcryptService()

const adminUsecase=new AdminUsecase(userRepository,bcryptService,tokenService)

const adminController=new AdminController(adminUsecase)

router.post('/login',(req:Request,res:Response,next:NextFunction)=>{ adminController.findAdmin(req,res,next)})
router.post('/logout',authenticateToken,authorizeRoles(UserRole.ADMIN),(req:Request,res:Response,next:NextFunction)=>{ adminController.logoutAdmin(req,res,next)})

router.get('/users',authenticateToken,authorizeRoles(UserRole.ADMIN),(req:Request,res:Response,next:NextFunction)=>{ adminController.getUsers(req,res,next)})

router.get('/block',authenticateToken,authorizeRoles(UserRole.ADMIN),(req:Request,res:Response,next:NextFunction)=>{ adminController.blockUser(req,res,next)})
router.get('/unblock',authenticateToken,authorizeRoles(UserRole.ADMIN),(req:Request,res:Response,next:NextFunction)=>{ adminController.getUsers(req,res,next)})


export default router