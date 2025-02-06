import crypto from "crypto";
import { JwtPayload } from "jsonwebtoken";
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
                isAdmin:boolean
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
                    avatar:null,
                    isAdmin:isAdmin
                })

                await this.sendMail.sendVerificationEmail(email, fullname, hashtoken);

                return {status:200, message: "Verification email sent. Please check your inbox." };

                
                
            }       

            async verifyEmail(email: string, emailToken: string) {
                try{
                const tempUser = await this.emailVerification.findTempUser(email, emailToken);
            
                if (!tempUser || tempUser.expiresAt < new Date()) {
                throw new Error("Invalid or expired token.");
                }
            
                const user = await this.userRepository.createUser(
                tempUser.email,
                tempUser.password,
                tempUser.fullname,
                tempUser.workSpaces || [], 
                tempUser.paymentDetail || { paymentType: "Non", startDate: new Date(), endDate: new Date() },
                tempUser.avatar,
                tempUser.isAdmin
                );
            
                await this.emailVerification.deleteTempUser(email);
                
                if('error' in user)
                {
                    throw new Error(user.error)
                }


                    
               return {user}
              }catch(error){
                console.error(error);
                return { status: 500, message: 'An error occurred during verifying email.' }; 
              } 
            }

            async findUser(email: string, password: string) {
                try {
                    const user = await this.userRepository.loginUser(email);
                    if (user==null) {
                        return { status: 404, message: "User not found!" }; 
                    }
            
                    if (!user?.password) {
                        return { status: 404, message: "No password Found!" };  
                    }
            
                    const compare = await this.bcryptService.comparePassword(password, user.password);
                    if (!compare) {
                        return { status: 401, message: 'Incorrect password!' }; 
                    }

                    const accessToken=await this.tokenService.generateToken({userId:user.id,userEmail:user.email,role:user.role})
                    const refreshToken=await this.tokenService.generateRefreshToken({userId:user.id,userEmail:user.email,role:user.role})
            
                    return { status: 200, user,accessToken,refreshToken };  
                } catch (error) {
                    console.error(error);
                    return { status: 500, message: 'An error occurred during login.' }; 
                }
            }
            async makeNewAccessToken(token:string){
                try {

                    const decoded=await this.tokenService.verifyRefreshToken(token)
                    if(!decoded)
                    {
                        return { status: 403, message: "Refresh token verification failed!" }
                    }
                    const { userId, email ,role} = decoded as JwtPayload;
                    const makeNewAccessToken=this.tokenService.generateToken({ userId: userId, email: email ,role})
                    if(!makeNewAccessToken)
                    {
                        return {status:404,message:"Error in new access token creation"}
                    }
                    return { status: 200, accessToken: makeNewAccessToken };

                } catch (error) {
                    console.log(error);
                    return { status: 500, message: 'An error occurred during refresh token verification.' }; 
                }
            }

            async resetPassword(email:string,password:string)
            {
                try {
                      
                    const hash=await this.bcryptService.hashPassword(password)
                    const updatedUser=await this.userRepository.updateUser(email,hash)
                    if(!updatedUser)
                    {
                        return null
                    }
                    await this.emailVerification.deleteTempUser(email)
                    
                    return {status:200,user:updatedUser}

                    
                } catch (error) {
                    console.log(error);
                    return { status: 500, message: 'An error occurred during refresh token verification.' }; 
                }
            }

            async sendEmail(email:string){
                try {

                    const hashtoken=crypto.randomBytes(32).toString('hex')

                  let verify= await this.sendMail.sendResetVerification(email,hashtoken);
                   await this.emailVerification.createEmailSpace(email,hashtoken)
                
                   return {status:200,verify}
                    
                } catch (error) {
                    console.log(error);
                    return { status: 500, message: 'An error occurred during email send.' }; 
                }
            }
            async findResetUser(email:string,token:string)
            {
                try {
                   let res=await this.emailVerification.findVerifiedUser(email,token)
                   if(!res)
                   {
                    return null
                   }
                   return {status:200,res}
                    
                } catch (error) {
                    console.log(error);
                    return { status: 500, message: 'An error occurred during finding reset password user' }; 
                }
            }

    }