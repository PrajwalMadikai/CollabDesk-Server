import { UserEntity } from "../../entities/userEntity";
import { UserRepository } from "../../respository/UserRespository";
import { GithubService } from "../services/GithubService";

export class GithubUsecase{
    constructor(
      private  userRepository:UserRepository,
       private githubService:GithubService
    ){}

    async handlegithubAuth(code: string):Promise<UserEntity>{

        const accessToken = await this.githubService.exchangeCodeForToken(code)
        
        const profile = await this.githubService.fetchUserProfile(accessToken);

        const existingUser = await this.userRepository.getUserByGithubId(profile.id);

        if (existingUser) {
            return existingUser;
        }

        const userData: UserEntity = {
            id: profile.id,
            email: profile.email,
            fullname: profile.name,
            avatar: profile.avatar_url,
            githubId: profile.id,
            workSpaces:[],
            isAdmin:false
            
          };
          
          const user = await this.userRepository.createGithubUser(profile.id, userData);
          return user  
    }

}