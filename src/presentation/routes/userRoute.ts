import express from 'express'
import { EmailService } from '../../applications/services/EmailService'
import { GoogleAuthService } from '../../applications/services/GoogleService'
import { TokenService } from '../../applications/services/TokenService'
import { BcryptService } from '../../applications/services/bcryptService'
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


const userUsecase=new UserUsecase(userRepository,hashService,tokenService,emailRepository,emailService)
const googleUsecase=new GoogleAuthUsecase(userRepository,googleService)


const loginController=new LoginController(userUsecase,googleUsecase)

router.post('/signup', loginController.registerUser.bind(loginController));
router.post('/verify-email', loginController.verifyEmail.bind(loginController));

// OAuth 2.0 Authorization Grant Flow
router.post('/google-signup',asyncHandler(loginController.googleSignUp.bind(loginController)));

export default router