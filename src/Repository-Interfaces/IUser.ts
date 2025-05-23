import { AdminEntity } from "../entities/adminEntity";
import { PaymentEntity } from "../entities/paymentEntity";
import { UserEntity } from "../entities/userEntity";

export interface UserInterface{
    createUser(email:string,password:string,fullname:string,
               workSpaces:{ workspaceId: string; workspaceName: string }[]
               ,paymentDetail: { paymentType: string;amount:number; startDate: Date; endDate: Date },
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

    updateUser(userId:string,password:string):Promise<UserEntity|null>

    blockUser(userId:string,):Promise<UserEntity|null>

    verifyUser(userId:string):Promise<UserEntity|null>

    fetchusers():Promise<UserEntity[]|null>

    updateuserName(userId:string,newName:string):Promise<UserEntity|null>

    fetchPlanDetails():Promise<PaymentEntity[]|null>

    storePaymentDetails(email:string,paymentType:string,amount:number):Promise<UserEntity|null>

    findUser(email:string):Promise<UserEntity|null>

    changePassword(userId:string,password:string):Promise<UserEntity|null>

    checkPassword(userId:string):Promise<UserEntity|null>
}