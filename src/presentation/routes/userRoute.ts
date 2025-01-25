import express from 'express'
import { EmailService } from '../../applications/services/EmailService'
import { TokenService } from '../../applications/services/TokenService'
import { BcryptService } from '../../applications/services/bcryptService'
import { UserUsecase } from '../../applications/usecases/UserUsecase'
import { EmailRepository } from '../../respository/EmailRepository'
import { UserRepository } from '../../respository/UserRespository'
import { LoginController } from '../controllers/loginController'

const router=express.Router()

const userRepository=new UserRepository()
const tokenService=new TokenService()
const hashService=new BcryptService()
const emailRepository=new EmailRepository()
const emailService=new EmailService()

const userUsecase=new UserUsecase(userRepository,hashService,tokenService,emailRepository,emailService)
const loginController=new LoginController(userUsecase)

router.post('/signup',loginController.registerUser.bind(loginController))
router.post('/verify-email', loginController.verifyEmail.bind(loginController));

export default router