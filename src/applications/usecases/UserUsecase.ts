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
                paymentDetail: { paymentType: string; startDate: Date; endDate: Date }
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
                tempUser.paymentDetail || { paymentType: "", startDate: new Date(), endDate: new Date() } 
                );
            
                await this.emailVerification.deleteTempUser(email);
                
                if('error' in user)
                    {
                        throw new Error(user.error)
                    }

                    const token=await this.tokenService.generateToken({userId:user.id,userEmail:user.email})
                    return {user,token}
            }
    }