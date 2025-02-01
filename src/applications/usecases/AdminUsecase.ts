import { UserRepository } from "../../respository/UserRespository";
import { BcryptService } from "../services/bcryptService";
import { TokenService } from "../services/TokenService";

export class AdminUsecase{
    constructor(
        private userRepository:UserRepository,
        private bcryptService:BcryptService,
        private tokenService:TokenService
    ){}

    async verfyAdmin(email:string,password:string)
    {
        try {
               const admin=await this.userRepository.loginAdmin(email)

               if(!admin){
                return  {status:404,message:"Couldn't find Admin"}
               }

               const hashedPassword=await this.bcryptService.comparePassword(password,admin.password)

               if(!hashedPassword)
               {
                return {status:404,message:"Incorrect password"}
               }
               const accessToken=await this.tokenService.generateToken({userId:admin.id,userEmail:admin.email})
               const refreshToken=await this.tokenService.generateRefreshToken({userId:admin.id,userEmail:admin.email})
               
               if(!accessToken)
               {
                return {status:404,message:"Error in JWT token creation"}
               }

               
               return {status:200,message:'Admin data is present',admin,accessToken,refreshToken}
              
            
        } catch (error) {
            console.log("error in verify Email",error);
            return { status: 500, message: 'An error occurred during admin login.' }; 
        }
    }

}