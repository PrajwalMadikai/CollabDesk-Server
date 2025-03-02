import express, { NextFunction, Request, Response } from 'express'
import { TokenService } from '../../applications/services/TokenService'
import { BcryptService } from '../../applications/services/bcryptService'
import { AdminUsecase } from '../../applications/usecases/AdminUsecase'
import { PaymentUsecase } from '../../applications/usecases/PaymentUsecase'
import { UserRole } from '../../interface/roles'
import { PaymentRepository } from '../../respository/PaymentRepository'
import { UserRepository } from '../../respository/UserRespository'
import { AdminController } from '../controllers/adminController'
import { PaymentController } from '../controllers/paymentController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'

const router=express.Router()

const userRepository=new UserRepository()
const paymentRepository=new PaymentRepository()

const tokenService=new TokenService()
const bcryptService=new BcryptService()

const adminUsecase=new AdminUsecase(userRepository,bcryptService,tokenService)
const paymentUsecase=new PaymentUsecase(paymentRepository,userRepository)

const adminController=new AdminController(adminUsecase)
const paymentController=new PaymentController(paymentUsecase)

router.post('/login',(req:Request,res:Response,next:NextFunction)=>{ adminController.findAdmin(req,res,next)})
router.post('/logout',(req:Request,res:Response,next:NextFunction)=>{ adminController.logoutAdmin(req,res,next)})

router.post('/refreshtoken',
(req:Request,res:Response,next:NextFunction)=>{ adminController.adminRefreshToken(req,res,next)})

router.get('/users',authenticateToken,authorizeRoles(UserRole.ADMIN,UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>{ adminController.getUsers(req,res,next)})

router.post('/block',authenticateToken,authorizeRoles(UserRole.ADMIN),
(req:Request,res:Response,next:NextFunction)=>{ adminController.blockUser(req,res,next)})

router.post('/unblock',authenticateToken,authorizeRoles(UserRole.ADMIN),
(req:Request,res:Response,next:NextFunction)=>{ adminController.unBlockUser(req,res,next)})


router.post('/payment-plan',authenticateToken,authorizeRoles(UserRole.ADMIN),
(req:Request,res:Response,next:NextFunction)=>{ paymentController.addPaymentPlan(req,res,next)})

router.get('/fetch-plans',authenticateToken,authorizeRoles(UserRole.ADMIN),
(req:Request,res:Response,next:NextFunction)=>{ paymentController.fetchPlans(req,res,next)})

router.get('/payment-stats',authenticateToken,authorizeRoles(UserRole.ADMIN),
(req:Request,res:Response,next:NextFunction)=>{ paymentController.paymentStates(req,res,next)})

router.get('/monthly-payments',authenticateToken,authorizeRoles(UserRole.ADMIN),
(req:Request,res:Response,next:NextFunction)=>{ paymentController.monthlyPayments(req,res,next)})

router.get('/plan-distribution',authenticateToken,authorizeRoles(UserRole.ADMIN),
(req:Request,res:Response,next:NextFunction)=>{ paymentController.planDistribution(req,res,next)})

router.delete('/payment-plan/:type',authenticateToken,authorizeRoles(UserRole.ADMIN),
(req:Request,res:Response,next:NextFunction)=>{ paymentController.planDelete(req,res,next)})


export default router