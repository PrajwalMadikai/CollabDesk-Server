import dotenv from 'dotenv';
import { GoogleAuthService } from "../../applications/services/GoogleService";
import { UserEntity } from "../../entities/userEntity";
import { UserRepository } from "../../respository/UserRespository";
import { TokenService } from '../services/TokenService';
dotenv.config()

interface AuthResponse {
    status: number;
    googleUser?: UserEntity;
    user?: UserEntity;
    accessToken: string;
    refreshToken: string;
    message: string;
}

export class GoogleAuthUsecase {
    constructor(
        private userRepository: UserRepository,
        private googleService: GoogleAuthService,
        private tokenService: TokenService
    ) {}

    async execute(idToken: string): Promise<AuthResponse> {  
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
        console.log("Google user payload:", { googleId, email, fullName, avatar });

        if (!googleId || !email || !fullName) {
            throw new Error("Missing Google user information.");
        }

        let user = await this.userRepository.findByGoogleId(googleId);
        console.log("find the old user:", user);

        let accessToken: string | { status: number, message: string };
        let refreshToken: string | { status: number, message: string };
        let googleUser: UserEntity | undefined;

        if (!user) {
            googleUser = await this.userRepository.createGoogleUser(email, fullName, googleId, avatar);
            accessToken = await this.tokenService.generateToken({ userId: googleUser.id, userEmail: googleUser.email });
            refreshToken = await this.tokenService.generateRefreshToken({ userId: googleUser.id, userEmail: googleUser.email });
            console.log("Created new Google user:", googleUser);

        } else {
            accessToken = await this.tokenService.generateToken({ userId: user.id, userEmail: user.email });
            refreshToken = await this.tokenService.generateRefreshToken({ userId: user.id, userEmail: user.email });
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
            message: user ? 'User authenticated successfully.' : 'User created successfully.'
        };
    }
}
