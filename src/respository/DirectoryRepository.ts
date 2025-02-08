import mongoose from "mongoose";
import { FolderModal } from "../database/models/directoryModal";
import { WorkspaceModal } from "../database/models/workspaceModal";
import { DirectoryEntity } from "../entities/directoryEntity";
import { DirectoryInterface } from "../Repository-Interfaces/IDirectory";

export class DirectoryRepository implements DirectoryInterface{
   
      async createFolder(name:string,workspaceId:string):Promise<DirectoryEntity|null>{

         const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

        let folder=await FolderModal.create({name,workspaceId:workspaceObjectId})
     
         let workspace=await WorkspaceModal.findByIdAndUpdate(workspaceObjectId,{$push:{directories:{dirId:folder._id,dirName:name}}})
         if(!workspace)
         {
            return null
         }
         
         return  new DirectoryEntity(
            folder.id,
            folder.name,
            folder.workspaceId,
            folder.files,
            folder.inTrash
         )

      }
      async updateName(folderId: string, newName: string): Promise<DirectoryEntity | null> {
         const folderObjectId = new mongoose.Types.ObjectId(folderId);
         let folder=await FolderModal.findByIdAndUpdate(folderObjectId,{$set:{name:newName}},{ new: true })
         if(!folder)
         {
            return null
         }

         return  new DirectoryEntity(
            folder.id,
            folder.name,
            folder.workspaceId,
            folder.files,
            folder.inTrash
         )
      }
}