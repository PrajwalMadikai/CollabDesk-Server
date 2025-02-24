import mongoose from "mongoose";
import { FolderModal } from "../database/models/directoryModal";
import { FileModal } from "../database/models/fileModal";
import { WorkspaceModal } from "../database/models/workspaceModal";
import { DirectoryEntity } from "../entities/directoryEntity";
import { TrashItems } from "../interface/trashItems";
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
            folder.inTrash,
            folder.deletedAt
         )

      }
      async updateName(folderId: string, newName: string): Promise<DirectoryEntity | null> {
         const folderObjectId = new mongoose.Types.ObjectId(folderId);
         let folder=await FolderModal.findByIdAndUpdate(folderObjectId,{$set:{name:newName}},{ new: true })
         if (folder) {
            await WorkspaceModal.findOneAndUpdate(
                { "directories.dirId": folderObjectId }, 
                { $set: { "directories.$.dirName": newName } },  
                { new: true } 
            );
        }
         if(!folder)
         {
            return null
         }

         return  new DirectoryEntity(
            folder.id,
            folder.name,
            folder.workspaceId,
            folder.files,
            folder.inTrash,
            folder.deletedAt
         )
      }

      async fetchFolders(workspaceId: string): Promise<DirectoryEntity[] | null> {
             const folders = await FolderModal.find({ workspaceId, inTrash: false })
                  
     
             if (!folders) return null;
     
             return folders.map((folder) => new DirectoryEntity(
               folder.id,
               folder.name,
               folder.workspaceId,
               folder.files,
               folder.inTrash,
               folder.deletedAt
           ));
           
     }

     async deleteFolder(folderId: string): Promise<DirectoryEntity | null> {
      
      let folder=await FolderModal.findByIdAndDelete(folderId)
      if(!folder)
      {
         return null
      }

      return  new DirectoryEntity(
         folder.id,
         folder.name,
         folder.workspaceId,
         folder.files,
         folder.inTrash,
         folder.deletedAt
      )
     }

     async fetchTrashItems(workspaceId:string):Promise<TrashItems>
     {
        const workspaceID=new mongoose.Types.ObjectId(workspaceId)
        
        const folders = await FolderModal.find({
         workspaceId: workspaceID
         }).select('_id').lean();

        const trashFiles = await FileModal.find({
               directoryId: { $in: folders.map(folder => folder._id) },
               inTrash: true
               }).select('name _id').lean();

        const trashFolders = await FolderModal.find({
                  workspaceId: workspaceID,
                  inTrash: true
               }).select('name _id').lean();

      return {
         folders: trashFolders.map(folder => ({
            _id: folder._id.toString(), 
            name: folder.name
        })),
        files: trashFiles.map(file => ({
            _id: file._id.toString(),  
            name: file.name
        }))
      };
   }
     
}