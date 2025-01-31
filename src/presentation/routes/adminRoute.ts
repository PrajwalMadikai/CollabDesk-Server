import express, { NextFunction, Request, Response } from 'express'
import { TokenService } from '../../applications/services/TokenService'
import { BcryptService } from '../../applications/services/bcryptService'
import { AdminUsecase } from '../../applications/usecases/AdminUsecase'
import { UserRepository } from '../../respository/UserRespository'
import { AdminController } from '../controllers/adminController'

const router=express.Router()

const userRepository=new UserRepository()

const tokenService=new TokenService()
const bcryptService=new BcryptService()

const adminUsecase=new AdminUsecase(userRepository,bcryptService,tokenService)

const adminController=new AdminController(adminUsecase)

router.post('/login',(req:Request,res:Response,next:NextFunction)=>{ adminController.findAdmin(req,res,next)})

export default router