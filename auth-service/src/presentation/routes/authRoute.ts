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
import { UserUsecase } from '../../applications/usecases/UserUsecase'
import { UserRole } from '../../interface/roles'
import { EmailRepository } from '../../respository/EmailRepository'
import { UserRepository } from '../../respository/UserRespository'
import { AuthController } from '../controllers/authController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'
import asyncHandler from '../utils/errorHandler'

const router=express.Router()

const userRepository=new UserRepository()

const tokenService=new TokenService()
const hashService=new BcryptService()
const emailRepository=new EmailRepository()
const emailService=new EmailService()
const googleService=new GoogleAuthService()
const githubService=new GithubService()
const multerService=new MulterService()
const cloudinaryService=new CloudinaryAdapter()

const userUsecase=new UserUsecase(userRepository,hashService,tokenService,emailRepository,emailService,cloudinaryService)
const googleUsecase=new GoogleAuthUsecase(userRepository,googleService,tokenService)
const githubUsecase=new GithubUsecase(userRepository,githubService,tokenService)

const authController=new AuthController(userUsecase,googleUsecase,githubUsecase)

router.post('/signup', authController.registerUser.bind(authController));

router.post('/login',asyncHandler(authController.LoginUser.bind(authController)))

router.post('/verify-email', asyncHandler(authController.verifyEmail.bind(authController)));

// OAuth 2.0 Authorization Grant Flow
router.post('/google-signup',asyncHandler(authController.googleSignUp.bind(authController)));

router.post('/google-login',asyncHandler(authController.googleLogin.bind(authController)));

router.get('/auth/github', asyncHandler(authController.gitHubAuth.bind(authController)));

router.get('/auth/github/callback', asyncHandler(authController.gitHubAuth.bind(authController)));

router.post('/refreshtoken',asyncHandler(authController.requestAccessToken.bind(authController)))
// reset password email verification
router.post('/send-mail',asyncHandler(authController.sendVerification.bind(authController)))

router.post('/email-check',asyncHandler(authController.verifyemailResetPassword.bind(authController)))

router.post('/reset-password',asyncHandler(authController.resetPassword.bind(authController)))

router.post('/logout',asyncHandler(authController.logoutUser.bind(authController)))

router.post('/verify-user',asyncHandler(authController.verifyUserLiveblocks.bind(authController)))

router.get('/fetch-user',asyncHandler(authController.fetchUsers.bind(authController)))

router.put('/update-name',asyncHandler(authController.renameUsername.bind(authController)))

router.get('/user/:userId',asyncHandler(authController.getUserData.bind(authController)))

router.post('/profile-upload',authenticateToken,authorizeRoles(UserRole.USER),
multerService.single("profileImage"),(req:Request,res:Response,next:NextFunction)=>{authController.updateProfile(req,res,next)})

router.put('/change-password',authenticateToken,authorizeRoles(UserRole.USER),
(req:Request,res:Response,next:NextFunction)=>{authController.changePassword(req,res,next)})

export default router
