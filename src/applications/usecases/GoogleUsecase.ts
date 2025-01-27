import dotenv from 'dotenv';
import { GoogleAuthService } from "../../applications/services/GoogleService";
import { UserEntity } from "../../entities/userEntity";
import { UserRepository } from "../../respository/UserRespository";
dotenv.config()

export class GoogleAuthUsecase {
    constructor(
        private userRepository: UserRepository,
        private googleService: GoogleAuthService
    ) {}

    async execute(idToken: string): Promise<UserEntity | void> {

        if(!process.env.GOOGLE_CLIENT_ID)
        {
            throw new Error('Google id cant access')
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

        let user =await this.userRepository.findByGoogleId(googleId);
        if (!user) {
            const googleUser = await this.userRepository.createGoogleUser(email, fullName, googleId, avatar);
            return googleUser;
        } else {
           return user
        }
    }
}
