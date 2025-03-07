import { UserRepository } from "../../respository/UserRespository";
import { GithubService } from "../services/GithubService";
import { TokenService } from "../services/TokenService";

export class GithubUsecase{
    constructor(
      private  userRepository:UserRepository,
       private githubService:GithubService,
       private jwtService:TokenService
    ){}

    async handleGithubAuth(code: string, mode: 'login' | 'signup'){
        const accessToken = await this.githubService.exchangeCodeForToken(code);
        const profile = await this.githubService.fetchUserProfile(accessToken);
        const existingUser = await this.userRepository.getUserByGithubId(profile.id);
 
        if (mode === 'login' && !existingUser) {
            throw new Error('Account not found. Please sign up first.');
        }
    
        if (mode === 'signup' && existingUser) {
            throw new Error('Account already exists. Please login instead.');
        }
    
        if (mode === 'login') {
            if (!existingUser) {
                throw new Error('Account not found. Please sign up first.');
            }
            let jwtAccessToken=await this.jwtService.generateToken({userId:existingUser.id,userEmail:existingUser.email,role:existingUser.role})
            let jwtRefreshToken=await this.jwtService.generateRefreshToken({userId:existingUser.id,userEmail:existingUser.email,role:existingUser.role})
            return {
                user: existingUser,
                isRegistered: true,
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken
            };
        }
    
        // Only create new user if in signup mode and user doesn't exist
        if (mode === 'signup' && !existingUser) {
            const newUser = await this.userRepository.createGithubUser(profile.id, {
                id: profile.id,
                email: profile.email,
                fullname: profile.name,
                avatar: profile.avatar_url,
                githubId: profile.id,
                workSpaces: [],
                role:profile.role,
                isAdmin: false,
                isBlock:false,
                paymentDetail:{
                    paymentType:'Non',
                    startDate:null,
                    endDate:null
                }
            });

            const jwtAccessToken=await this.jwtService.generateToken({userId:newUser.id,userEmail:newUser.email,role:newUser.role})
            const jwtRefreshToken=await this.jwtService.generateRefreshToken({userId:newUser.id,userEmail:newUser.email,role:newUser.role})
    
            return {
                user: newUser,
                isRegistered: false,
                accessToken:jwtAccessToken,
                refreshToken:jwtRefreshToken
            };
        }
    
        throw new Error('Invalid authentication state');
    }
}