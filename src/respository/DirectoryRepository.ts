import mongoose from "mongoose";
import { FolderModal } from "../database/models/directoryModal";
import { FileModal } from "../database/models/fileModal";
import { paymentModal } from "../database/models/PaymentModal";
import { UserModal } from "../database/models/userModal";
import { WorkspaceModal } from "../database/models/workspaceModal";
import { DirectoryEntity } from "../entities/directoryEntity";
import { TrashItems } from "../interface/trashItems";
import { DirectoryInterface } from "../Repository-Interfaces/IDirectory";

export class DirectoryRepository implements DirectoryInterface{

   async createFolder(name: string, workspaceId: string, userId: string): Promise<DirectoryEntity | null> {
      const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      const user = await UserModal.findById(userObjectId);
      if (!user) {
          throw new Error("User not found");
      }
  
      const planType = user.paymentDetail.paymentType;
      let folderLimit = 1; 
  
      if (planType !== "Non") {
          const plan = await paymentModal.findOne({ paymentType: planType });
          if (!plan) {
              throw new Error("Subscription plan not found");
          }
          folderLimit = plan.FolderNum;
      }
      
      
      const workspace = await WorkspaceModal.findById(workspaceObjectId);
      if (!workspace) {
          return null;
      }
  
      if (workspace.directories.length >= folderLimit) {
          throw new Error(`Folder limit exceeded for ${planType} plan`);
      }
  
      const folder = await FolderModal.create({ name, workspaceId: workspaceObjectId });
  
      await WorkspaceModal.findByIdAndUpdate(
         workspaceObjectId,
         {
           $push: {
             directories: { dirId: folder._id, dirName: name },  
             activity: {
               email: user.email,  
               action: `created a folder named "${name}"`,  
               time: new Date(),  
             },
           },
         },
         { new: true }  
       );

      return new DirectoryEntity(
          folder.id,
          folder.name,
          folder.workspaceId,
          folder.files,
          folder.inTrash,
          folder.deletedAt
      );
  }
      async updateName(folderId: string, newName: string,email:string): Promise<DirectoryEntity | null> {
         const folderObjectId = new mongoose.Types.ObjectId(folderId);
         let folder=await FolderModal.findByIdAndUpdate(folderObjectId,{$set:{name:newName}},{ new: true })
         if (folder) {
            await WorkspaceModal.findOneAndUpdate(
                { "directories.dirId": folderObjectId }, 
                { $set: { "directories.$.dirName": newName },
                  $push:{
                     activity: {
                        email: email,  
                        action: `Reanamed folder name to "${newName}"`,  
                        time: new Date(),  
                      },
                  }
               },  
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
   async moveFoldertoTrash(folderId:string,workspaceId:string,email:string):Promise<DirectoryEntity|null>
   {
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 7);

      const folderID=new mongoose.Types.ObjectId(folderId)

      const folder=await FolderModal.findByIdAndUpdate(folderID,{
         inTrash:true,
         deletedAt:deletionDate
      },{new:true})

      if(!folder) return null

      await WorkspaceModal.findByIdAndUpdate(
         new mongoose.Types.ObjectId(workspaceId),
         {
           $pull: { directories: { dirId: folderId } },  
           $push: {
             activity: {
               email: email, 
               action: `moved to trash folder named "${folder.name}"`, 
               time: new Date(), 
             },
           },
         },
         { new: true } 
       );
     return  new DirectoryEntity(
               folder.id,
               folder.name,
               folder.workspaceId,
               folder.files,
               folder.inTrash,
               folder.deletedAt
            )
   }

   async restoreFolder(folderId:string,email:string):Promise<DirectoryEntity|null>
   {
      const folder=await FolderModal.findByIdAndUpdate(new mongoose.Types.ObjectId(folderId),
         {
            inTrash:false,
            deletedAt:null
         },{new:true})

         if(!folder) return null

         await WorkspaceModal.findByIdAndUpdate(
            folder.workspaceId,
            {
              $push: {
                directories: { dirId: folder._id, dirName: folder.name },  
                activity: {
                  email: email,  
                  action: `Restored folder named "${folder.name}" from trash`,  
                  time: new Date(),  
                },
              },
            },
            { new: true }  
          );

      return  new DirectoryEntity(
         folder.id,
         folder.name,
         folder.workspaceId,
         folder.files,
         folder.inTrash,
         folder.deletedAt
      )
   }
}