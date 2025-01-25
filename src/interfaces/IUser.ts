import { UserEntity } from "../entities/userEntity";

export interface UserInterface{
    createUser(email:string,password:string,fullname:string,
               workSpaces:{ workspaceId: string; workspaceName: string }[]
               ,paymentDetail: { paymentType: string; startDate: Date; endDate: Date }
              ):Promise<UserEntity | { error: string }>
    // findByEmail(email:string):Promise<UserEntity>
    // updateUser(email:string):Promise<UserEntity>
    // deleteUser(email:string):Promise<UserEntity>
}