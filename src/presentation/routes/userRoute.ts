import express from 'express'
import { EmailService } from '../../applications/services/EmailService'
import { GithubService } from '../../applications/services/GithubService'
import { GoogleAuthService } from '../../applications/services/GoogleService'
import { TokenService } from '../../applications/services/TokenService'
import { BcryptService } from '../../applications/services/bcryptService'
import { GithubUsecase } from '../../applications/usecases/GithubUsecase'
import { GoogleAuthUsecase } from '../../applications/usecases/GoogleUsecase'
import { UserUsecase } from '../../applications/usecases/UserUsecase'
import { EmailRepository } from '../../respository/EmailRepository'
import { UserRepository } from '../../respository/UserRespository'
import { LoginController } from '../controllers/loginController'
import asyncHandler from '../utils/errorHandler'

const router=express.Router()

const userRepository=new UserRepository()
const tokenService=new TokenService()
const hashService=new BcryptService()
const emailRepository=new EmailRepository()
const emailService=new EmailService() 
const googleService=new GoogleAuthService()
const githubService=new GithubService()

const userUsecase=new UserUsecase(userRepository,hashService,tokenService,emailRepository,emailService)
const googleUsecase=new GoogleAuthUsecase(userRepository,googleService)
const githubUsecase=new GithubUsecase(userRepository,githubService)

const loginController=new LoginController(userUsecase,googleUsecase,githubUsecase)

router.post('/signup', loginController.registerUser.bind(loginController));
router.post('/login',asyncHandler(loginController.LoginUser.bind(loginController)))

router.post('/verify-email', loginController.verifyEmail.bind(loginController));

// OAuth 2.0 Authorization Grant Flow
router.post('/google-signup',asyncHandler(loginController.googleSignUp.bind(loginController)));

router.get('/auth/github', asyncHandler(loginController.gitHubAuth.bind(loginController)));
router.get('/auth/github/callback', asyncHandler(loginController.gitHubAuth.bind(loginController)));

export default router