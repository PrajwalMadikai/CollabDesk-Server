import { UserRepository } from "../../respository/UserRespository";
import { WorkspaceRepository } from "../../respository/WorkspaceRepository";

export class WorkspaceUsecase{
    constructor(
        private workspaceRepo:WorkspaceRepository,
        private userRepository:UserRepository
    ){}

    async createSpace(name: string, ownerId: string,){
        try{
        const space= await this.workspaceRepo.registeringSpace(name,ownerId)
        if (!space) {
            return null;   
        }
       await this.userRepository.insertWorkspace(space.ownerId,space.name,space.id)
       
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
        return result.workSpaces.map(workspace => ({
            workspaceId: workspace.workspaceId, 
            workspaceName: workspace.workspaceName
          }));
       }catch(error)
       {
        console.log(error);
        return { status: 500, message: 'An error occurred during fetching user workspace.' }; 
       } 
    }

    async addUsertoWorkspace(email:string,workspaceId:string )
    {
        try {
              
            let user=await this.workspaceRepo.addCollaborator(email,workspaceId)
            if(!user)
            {
                return null
            }
            return user.userDetails
            
        } catch (error) {
            console.log(error);
            return { status: 500, message: 'An error occurred during adding collaborator to workspace.' }; 
        }
    }
    async findCollaborators(workspaceId:string)
    {
        try {
               const users=await this.workspaceRepo.fetchAllcollaborators(workspaceId)
               if(!users) return null
                return users
        } catch (error) {
            console.log(error);
            return { status: 500, message: 'An error occurred during fetching collaborator.' }; 
        }
    }
    async updateSpaceName(workspaceId:string,newName:string)
    {
        try {
              
           let space=await this.workspaceRepo.renameSpacename(workspaceId,newName)
           if(!space) return null

           return space

        } catch (error) {
            console.log(error);
            return { status: 500, message: 'An error occurred during renaming workspace.' };
        }
    }

    async removeCollaborator(email:string,workspaceId:string)
    {
        try {
               const space=await this.workspaceRepo.removeCollaborator(email,workspaceId)
               if(!space) return null
               return space
        } catch (error) {
            console.log(error);
            return { status: 500, message: 'An error occurred during renaming workspace.' };
        }
    }
}