import { AdminEntity } from "../entities/adminEntity";
import { UserEntity } from "../entities/userEntity";

export interface UserInterface{
    createUser(email:string,password:string,fullname:string,
               workSpaces:{ workspaceId: string; workspaceName: string }[]
               ,paymentDetail: { paymentType: string; startDate: Date; endDate: Date },
               avatar:string|null,isAdmin:boolean
              ):Promise<UserEntity | { error: string }>

    createGoogleUser(email:string,fullName:string,
                    googleId:string,avatar:string
                    ):Promise<UserEntity>
    findByGoogleId(googleId: string): Promise<UserEntity | null>

    createGithubUser(githubId: string, userData: UserEntity):Promise<UserEntity>
    loginUser(email:string):Promise<UserEntity|null>
    loginAdmin(email:string,password:string,isAdmin:boolean):Promise<AdminEntity|null>
                
}