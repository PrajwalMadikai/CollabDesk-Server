import { WorkspaceModal } from "../database/models/workspaceModal";
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
}