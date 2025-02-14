import { AdminEntity } from "../entities/adminEntity";
import { UserEntity } from "../entities/userEntity";

export interface UserInterface{
    createUser(email:string,password:string,fullname:string,
               workSpaces:{ workspaceId: string; workspaceName: string }[]
               ,paymentDetail: { paymentType: string; startDate: Date; endDate: Date },
               avatar:string|null,
              ):Promise<UserEntity | { error: string }>

    createGoogleUser(email:string,fullName:string,
                    googleId:string,avatar:string
                    ):Promise<UserEntity|null>
    findByGoogleId(googleId: string): Promise<UserEntity | null>

    createGithubUser(githubId: string, userData: UserEntity):Promise<UserEntity>

    loginUser(email:string):Promise<UserEntity|null>

    loginAdmin(email:string,password:string,isAdmin:boolean):Promise<AdminEntity|null>

    findAllUsers():Promise<UserEntity[]|null>

    insertWorkspace(ownerId:string,name:string,wid:string):Promise<UserEntity|null>

    updateUser(userId:string,password:string):Promise<UserEntity|null>

    blockUser(userId:string,):Promise<UserEntity|null>

    verifyUser(userId:string):Promise<UserEntity|null>
}