    import crypto from "crypto";
import { EmailRepository } from "../../respository/EmailRepository";
import { UserRepository } from "../../respository/UserRespository";
import { BcryptService } from "../services/bcryptService";
import { EmailService } from "../services/EmailService";
import { TokenService } from "../services/TokenService";

    export class UserUsecase{
        

        constructor( 
            private userRepository:UserRepository,
            private bcryptService:BcryptService,
            private tokenService:TokenService,
            private emailVerification:EmailRepository,
            private sendMail:EmailService
                ){}
            
            async registerUser(
                email: string,
                password: string,
                fullname: string,
                workSpaces: { workspaceId: string; workspaceName: string }[]=[],
                paymentDetail: { paymentType: string; startDate: Date; endDate: Date },
                googleId?:string,
                avatar?:string
            ){
                const hashedPassword=await this.bcryptService.hashPassword(password)

                const hashtoken=crypto.randomBytes(32).toString('hex')
                const expiresAt = new Date(Date.now() + 3600000);

               

                await this.emailVerification.createTempUser({
                    email,
                    password: hashedPassword,
                    fullname,
                    token:hashtoken,
                    expiresAt,
                    workSpaces,
                    paymentDetail,
                    googleId:null,
                    avatar:null,
                    githubId:null
                })

                await this.sendMail.sendVerificationEmail(email, fullname, hashtoken);

                return { message: "Verification email sent. Please check your inbox." };

                
                
            }       

            async verifyEmail(email: string, emailToken: string) {

                const tempUser = await this.emailVerification.findTempUser(email, emailToken);
            
                if (!tempUser || tempUser.expiresAt < new Date()) {
                throw new Error("Invalid or expired token.");
                }
            
                const user = await this.userRepository.createUser(
                tempUser.email,
                tempUser.password,
                tempUser.fullname,
                tempUser.workSpaces || [], 
                tempUser.paymentDetail || { paymentType: "", startDate: new Date(), endDate: new Date() },
                tempUser.googleId,
                tempUser.avatar,
                tempUser.githubId
                );
            
                
                if('error' in user)
                {
                    throw new Error(user.error)
                }

               await this.emailVerification.deleteTempUser(email);

                    
               return {user}
            }

            async findUser(email: string, password: string) {
                try {
                    const user = await this.userRepository.loginUser(email);
                    if (!user) {
                        return { status: 404, message: "No User Found!" }; 
                    }
            
                    if (!user?.password) {
                        return { status: 404, message: "No password Found!" };  
                    }
            
                    const compare = await this.bcryptService.comparePassword(password, user.password);
                    if (!compare) {
                        return { status: 401, message: 'Incorrect password!' }; 
                    }

                    const accessToken=await this.tokenService.generateToken({userId:user.id,userEmail:user.email})
                    const refreshToken=await this.tokenService.generateRefreshToken({userId:user.id,userEmail:user.email})
            
                    return { status: 200, user,accessToken,refreshToken };  
                } catch (error) {
                    console.error(error);
                    return { status: 500, message: 'An error occurred during login.' }; 
                }
            }
            
    }