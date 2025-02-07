import mongoose from "mongoose";
import { FolderModal } from "../database/models/directoryModal";
import { WorkspaceModal } from "../database/models/workspaceModal";
import { DirectoryEntity } from "../entities/directoryEntity";
import { DirectoryInterface } from "../Repository-Interfaces/IDirectory";

export class DirectoryRepository implements DirectoryInterface{
      async createFolder(name:string,workspaceId:string):Promise<DirectoryEntity|null>{


       const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
        let folder=await FolderModal.create({name,workspaceId:workspaceObjectId})
     console.log('folder',folder);
     
         let workspace=await WorkspaceModal.findByIdAndUpdate(workspaceObjectId,{$push:{directories:{dirId:folder._id,dirName:name}}})
         if(!workspace)
         {
            return null
         }
         console.log('workspace upadrte;',workspace);
         
         return  new DirectoryEntity(
            folder.name,
            folder.workspaceId,
            folder.files,
            folder.inTrash
         )

      }
}