import { UserEntity } from "../../entities/userEntity";
import { UserRepository } from "../../respository/UserRespository";
import { GithubService } from "../services/GithubService";

export class GithubUsecase{
    constructor(
      private  userRepository:UserRepository,
       private githubService:GithubService
    ){}

    async handleGithubAuth(code: string, mode: 'login' | 'signup'): Promise<{ user: UserEntity; isRegistered: boolean }> {
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
            return {
                user: existingUser,
                isRegistered: true
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
                isBlock:false
            });
    
            return {
                user: newUser,
                isRegistered: false
            };
        }
    
        throw new Error('Invalid authentication state');
    }
    

 

}