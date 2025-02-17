import mongoose from "mongoose";
import { UserModal } from "../database/models/userModal";
import { WorkspaceModal } from "../database/models/workspaceModal";
import { UserEntity } from "../entities/userEntity";
import { workspaceEnity } from "../entities/workspaceEntity";
import { workspaceInterface } from "../Repository-Interfaces/IWorkspace";

export class WorkspaceRepository implements workspaceInterface{
   async registeringSpace(name: string, ownerId: string, directories?: { Did: string; Dname: string; }[], 
                userDetails?: { uId: string; email: string; }[], meetingRoom?: string, 
              type?: string, trashId?: string | null): Promise<workspaceEnity|null> 
        {
            const exists=await WorkspaceModal.findOne({ownerId,name})
            if(exists)
            {
                return null
            }
            const space=await WorkspaceModal.create({name,ownerId,directories,userDetails,meetingRoom,type,trashId})

            return new workspaceEnity(
                space.id,
                space.name,
                space.ownerId,
                space.directories,
                space.userDetails,
                space.meetingRoom,
                space.type,
                space.trashId
            )
        }
    async userWorkspace(userId: string): Promise<UserEntity | null> {
        const user=await UserModal.findById(userId)
        
        
        if(!user)
        {
            return null
        }
        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.googleId,
            user.avatar,
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        )
    } 
    
    async addCollaborator(email: string, workspaceId: string): Promise<workspaceEnity | null> {
        
        const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

        const user=await UserModal.findOne({email})
         if(!user)
         {
            return null
         }

         const alreadyExist=await WorkspaceModal.findOne({_id:workspaceObjectId,
                                                     userDetails:{$elemMatch:{userEmail:email}}})
         if(alreadyExist)
         {
            console.log('user is at the workspace');
            
            return null
         }
       

        let space=await WorkspaceModal.findByIdAndUpdate(workspaceObjectId,
                    {$push:{userDetails:{userId:user.id,userEmail:email}}
                    },{new:true})
        if(!space)
        {
          return null
        }

      let upuser=  await UserModal.updateOne({email},{
            $push:{workSpaces:{workspaceId:space.id,workspaceName:space.name}}
        },{new:true})
        console.log('user in add collab:',upuser);
        
        

        return new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.meetingRoom,
            space.type,
            space.trashId
        )
    }
    async fetchAllcollaborators(workspaceId:string):Promise<workspaceEnity[]|null>
    {
        const spaces=await WorkspaceModal.find({_id:new mongoose.Types.ObjectId(workspaceId)})
        if(!spaces) return null

        return spaces.map((space)=> new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.meetingRoom,
            space.type,
            space.trashId
        ))
    }
}