import dotenv from 'dotenv';
import { GoogleAuthService } from "../../applications/services/GoogleService";
import { UserEntity } from "../../entities/userEntity";
import { USERMESSAGES } from '../../presentation/messages/userMessages';
import { UserRepository } from "../../respository/UserRespository";
import { TokenService } from '../services/TokenService';
dotenv.config()

type AuthResponse =
  | {
      status: number;
      user?: any;   
      googleUser?: any;   
      accessToken?: string;  
      refreshToken?: string; 
      message: string;
    };



export class GoogleAuthUsecase {
    constructor(
        private userRepository: UserRepository,
        private googleService: GoogleAuthService,
        private tokenService: TokenService
    ) {}

    async execute(idToken: string): Promise<AuthResponse > {  
        if (!process.env.GOOGLE_CLIENT_ID) {
            throw new Error('Google ID can\'t be accessed');
        }

        const oauth2Client = this.googleService.getClient(process.env.GOOGLE_CLIENT_ID);
        const ticket = await oauth2Client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error("Invalid Google token.");
        }

        const { sub: googleId, email, name: fullName, picture: avatar } = payload;

        if (!googleId || !email || !fullName) {
            throw new Error("Missing Google user information.");
        }

        let user = await this.userRepository.findByGoogleId(googleId);
        console.log("find the old user:", user);

        let accessToken: string | { status: number, message: string };
        let refreshToken: string | { status: number, message: string };
        let googleUser: UserEntity | undefined|null;

        if (!user) {
            googleUser = await this.userRepository.createGoogleUser(email, fullName, googleId, avatar);
            if(googleUser==null)
            {
                return { status: 404, message: "User already exist" };
            }
            accessToken =await this.tokenService.generateToken({ userId: googleUser.id, userEmail: googleUser.email, role: googleUser.role  });
            refreshToken =await this.tokenService.generateRefreshToken({ userId: googleUser.id, userEmail: googleUser.email, role: googleUser.role });

        } else {
            accessToken =await this.tokenService.generateToken({ userId: user.id, userEmail: user.email, role: user.role });
            refreshToken =await this.tokenService.generateRefreshToken({ userId: user.id, userEmail: user.email, role: user.role });
        }

        if (typeof accessToken === 'object' && 'status' in accessToken) {
            return { 
                status: accessToken.status, 
                message: accessToken.message,
                accessToken: '',   
                refreshToken: ''   
            };
        }

        if (typeof refreshToken === 'object' && 'status' in refreshToken) {
            return { 
                status: refreshToken.status, 
                message: refreshToken.message,
                accessToken: '',   
                refreshToken: ''  
            };
        }

        return {
            status: 200,
            user: user || googleUser,  
            accessToken,
            refreshToken,
            message: user ?  USERMESSAGES.SUCCESS.GOOGLE_AUTH : USERMESSAGES.SUCCESS.GOOGLE_SIGNUP
        };
    }

    async executeLogin(idToken: string): Promise<AuthResponse> {
        if (!process.env.GOOGLE_CLIENT_ID) {
            return { status: 500, message: "Google ID can't be accessed" };
        }
    
        const oauth2Client = this.googleService.getClient(process.env.GOOGLE_CLIENT_ID);
    
        const ticket = await oauth2Client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    
        const payload = ticket.getPayload();
        if (!payload) {
            return { status: 401, message: "Invalid Google token." };
        }
    
        const { sub: googleId, email, name: fullName, picture: avatar } = payload;
    
        if (!googleId || !email || !fullName) {
            return { status: 400, message: "Missing Google user information." };
        }
    
        let user = await this.userRepository.findByGoogleId(googleId);
        if (!user) {
            return { status: 404, message: "Invalid user! Please register." };
        }
    
        let accessToken = this.tokenService.generateToken({ userId: user.id, userEmail: user.email, role: user.role });
        let refreshToken = this.tokenService.generateRefreshToken({ userId: user.id, userEmail: user.email, role: user.role });
    
        if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
            return { status: 500, message: "Failed to generate tokens." };
        }
    
        return {
            status: 200,
            user: user,  
            accessToken,
            refreshToken,
            message: "User authenticated successfully.",
        };
    }
    
}
