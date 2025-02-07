import { UserRepository } from "../../respository/UserRespository";
import { WorkspaceRepository } from "../../respository/WorkspaceRepository";

export class WorkspaceUsecase{
    constructor(
        private workspaceRepo:WorkspaceRepository,
        private userRepository:UserRepository
    ){}

    async createSpace(
        name: string, ownerId: string,
    ){
        try{
        const space= await this.workspaceRepo.registeringSpace(name,ownerId)
        if (!space) {
            return null;   
        }
       await this.userRepository.insertWorkspace(space.ownerId,space.name,space.id)
       
        console.log('usecase:',space);
        return space
       }catch(error)
       {
        return {status:500,message:"An error occurred during creating workspace"}
       }
    }
    async fetchWorkspace(userId:string)
    {
        try{
        let result=await this.workspaceRepo.userWorkspace(userId)
        if(!result)
        {
            return null
        }
        return result.workSpaces
       }catch(error)
       {
        console.log(error);
        return { status: 500, message: 'An error occurred during fetching user workspace.' }; 
       } 
    }

}