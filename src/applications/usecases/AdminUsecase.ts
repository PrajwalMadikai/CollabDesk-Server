import { UserRole } from "../../interface/roles";
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
               const accessToken=await this.tokenService.generateToken({userId:admin.id,userEmail:admin.email,role:UserRole.ADMIN})
               const refreshToken=await this.tokenService.generateRefreshToken({userId:admin.id,userEmail:admin.email,role:UserRole.ADMIN})
               
               if(!accessToken)
               {
                return {status:404,message:"Error in JWT token creation"}
               }

               
               return {status:200,message:'Admin is present',admin,accessToken,refreshToken}
              
            
        } catch (error) {
            console.log("error in verify Email",error);
            return { status: 500, message: 'An error occurred during admin login.' }; 
        }
    }

    async findAllUsers(){
        try {

            const users=await this.userRepository.findAllUsers()
            if(!users)
            {
                return  null

            }
            return {status:200,messages:"users fetched successfully",users}
        } catch (error) {
            console.log("error in verify Email",error);
            return { status: 500, message: 'An error occurred during fetching users.' }; 
        }
    }

    async block(userId:string)
    {
        try {

            let blocked=await this.userRepository.blockUser(userId)
            if(!blocked)
            {
                return null
            }

            return blocked
            
        } catch (error) {
            console.log("error in blocking user",error);
            return { status: 500, message: 'An error occurred during blocking users.' }; 
        }
    }

    async makeAdminrefreshToken(token: string) {
        try {
            const decoded = await this.tokenService.verifyRefreshToken(token);
            if (!decoded || "status" in decoded) {
                return null;
            }
            
            const makeNewAccessToken = this.tokenService.generateToken({
                userId: decoded.userId,  
                userEmail: decoded.userEmail,  
                role: decoded.role
            });
    
            if (typeof makeNewAccessToken === 'string') {
                return makeNewAccessToken;
            }
            
            return null;
        } catch (error) {
            console.log("error in making new admin access token", error);
            return null;
        }
    }

}