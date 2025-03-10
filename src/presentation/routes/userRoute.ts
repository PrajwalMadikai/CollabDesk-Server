import express, { NextFunction, Request, Response } from 'express'
import { CloudinaryAdapter } from '../../applications/services/CloudinaryService'
import { EmailService } from '../../applications/services/EmailService'
import { GithubService } from '../../applications/services/GithubService'
import { GoogleAuthService } from '../../applications/services/GoogleService'
import { MulterService } from '../../applications/services/MulterService'
import { TokenService } from '../../applications/services/TokenService'
import { BcryptService } from '../../applications/services/bcryptService'
import { GithubUsecase } from '../../applications/usecases/GithubUsecase'
import { GoogleAuthUsecase } from '../../applications/usecases/GoogleUsecase'
import { PaymentUsecase } from '../../applications/usecases/PaymentUsecase'
import { UserUsecase } from '../../applications/usecases/UserUsecase'
import { UserRole } from '../../interface/roles'
import { EmailRepository } from '../../respository/EmailRepository'
import { PaymentRepository } from '../../respository/PaymentRepository'
import { UserRepository } from '../../respository/UserRespository'
import { LoginController } from '../controllers/loginController'
import { PaymentController } from '../controllers/paymentController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'
import asyncHandler from '../utils/errorHandler'

const router=express.Router()

const userRepository=new UserRepository()
const paymentRepository=new PaymentRepository()

const tokenService=new TokenService()
const hashService=new BcryptService()
const emailRepository=new EmailRepository()
const emailService=new EmailService() 
const googleService=new GoogleAuthService()
const githubService=new GithubService()
const multerService=new MulterService()
const cloudinaryService=new CloudinaryAdapter()

const paymentUsecase=new PaymentUsecase(paymentRepository,userRepository)
const userUsecase=new UserUsecase(userRepository,hashService,tokenService,emailRepository,emailService,cloudinaryService)
const googleUsecase=new GoogleAuthUsecase(userRepository,googleService,tokenService)
const githubUsecase=new GithubUsecase(userRepository,githubService,tokenService)

const loginController=new LoginController(userUsecase,googleUsecase,githubUsecase)
const paymentController=new PaymentController(paymentUsecase)

router.post('/signup', loginController.registerUser.bind(loginController));

router.post('/login',asyncHandler(loginController.LoginUser.bind(loginController)))

router.post('/verify-email', asyncHandler(loginController.verifyEmail.bind(loginController)));

// OAuth 2.0 Authorization Grant Flow
router.post('/google-signup',asyncHandler(loginController.googleSignUp.bind(loginController)));

router.post('/google-login',asyncHandler(loginController.googleLogin.bind(loginController)));

router.get('/auth/github', asyncHandler(loginController.gitHubAuth.bind(loginController)));

router.get('/auth/github/callback', asyncHandler(loginController.gitHubAuth.bind(loginController)));

router.post('/refreshtoken',asyncHandler(loginController.requestAccessToken.bind(loginController)))
// reset password email verification
router.post('/send-mail',asyncHandler(loginController.sendVerification.bind(loginController)))

router.post('/email-check',asyncHandler(loginController.verifyemailResetPassword.bind(loginController)))

router.post('/reset-password',asyncHandler(loginController.resetPassword.bind(loginController)))

router.post('/logout',asyncHandler(loginController.logoutUser.bind(loginController)))

router.post('/verify-user',asyncHandler(loginController.verifyUserLiveblocks.bind(loginController)))

router.get('/fetch-user',asyncHandler(loginController.fetchUsers.bind(loginController)))

router.put('/update-name',asyncHandler(loginController.renameUsername.bind(loginController)))

router.get('/get-plans',asyncHandler(loginController.getPaymentPlans.bind(loginController)))

router.get('/user/:userId',asyncHandler(loginController.getUserData.bind(loginController)))


router.post('/payment-details',authenticateToken,authorizeRoles(UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>{paymentController.payment(req,res,next)})

router.post('/profile-upload',authenticateToken,authorizeRoles(UserRole.USER),
multerService.single("profileImage"),(req:Request,res:Response,next:NextFunction)=>{loginController.updateProfile(req,res,next)})

export default router