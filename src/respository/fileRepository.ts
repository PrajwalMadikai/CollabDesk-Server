import mongoose from "mongoose";
import { FolderModal } from "../database/models/directoryModal";
import { FileModal } from "../database/models/fileModal";
import { DirectoryEntity } from "../entities/directoryEntity";
import { FileEntity } from "../entities/fileEntity";
import { FileInterface } from "../Repository-Interfaces/IFile";

export class FileRepository implements FileInterface{
   async createFile(folderId: string): Promise<DirectoryEntity | null> {
         
         let file = await FileModal.create({ name:"Untitled", directoryId: new mongoose.Types.ObjectId(folderId) });

        if (!file) return null;

        let updatedFolder = await FolderModal.findByIdAndUpdate(
            folderId,
            { $push: { files: { fileId: file._id, fileName: file.name } } },  
            { new: true }
        ).populate("files.fileId", "name");  
        

        if(!updatedFolder) return null

        return  new DirectoryEntity(
            updatedFolder.id,
            updatedFolder.name,
            updatedFolder.workspaceId,
            updatedFolder.files,
            updatedFolder.inTrash
         )
    }

    async deleteFile(fileId: string, folderId: string): Promise<DirectoryEntity | null> {

        let file = await FileModal.deleteOne({_id:fileId});
        
        if(!file)
        {
            return null
        }
        let updatedFolder = await FolderModal.findByIdAndUpdate(
            folderId,
            { $pull: { files: { fileId: fileId } } }, 
            { new: true }
        );
        

        if(!updatedFolder)
        {
            return null
        }


        return  new DirectoryEntity(
            updatedFolder.id,
            updatedFolder.name,
            updatedFolder.workspaceId,
            updatedFolder.files,
            updatedFolder.inTrash
         )
    }
    async fetchFileContent(fileId: string): Promise<FileEntity | null> {
        let file =await FileModal.findById(fileId)
        if(!file) return null

        return new FileEntity(
            file.id,
            file.name,
            file.directoryId,
            file.published,
            file.url,
            file.content,
            file.coverImage,
            file.inTrash
        )
        
    }
    async fetchFile(folderId:string):Promise<DirectoryEntity|null>
    {
        const files=await FolderModal.findById(folderId)
        if(!files) return null
  
        
        return  new DirectoryEntity(
            files.id,
            files.name,
            files.workspaceId,
            files.files,
            files.inTrash
         )
    }
    async updateFileContent(fileId: string, content: string): Promise<FileEntity | null> {
        const file=await FileModal.findByIdAndUpdate(fileId,{$set:{content}})
        if(!file)
        {
            console.log('there is no file');
            
        }
        
        if(!file) return null

        return new FileEntity(
            file.id,
            file.name,
            file.directoryId,
            file.published,
            file.url,
            file.content,
            file.coverImage,
            file.inTrash
        )
    }
    async updateFileName(fileId: string, folderId: string, name: string): Promise<FileEntity | null> {
            
        const file=await FileModal.findByIdAndUpdate(new mongoose.Types.ObjectId(fileId),{
            $set:{name}
        },{new:true})
        if(!file) return null

       const folder= await FolderModal.findByIdAndUpdate(new mongoose.Types.ObjectId(folderId),{
            $set:{files:{fileId,fileName:name}}
        })
        

        return new FileEntity(
            file.id,
            file.name,
            file.directoryId,
            file.published,
            file.url,
            file.content,
            file.coverImage,
            file.inTrash
        )
    }
    async uploadImage(fileId:string,imageUrl:string):Promise<FileEntity|null>{

        const file=await FileModal.findByIdAndUpdate(new mongoose.Types.ObjectId(fileId),{
            $set:{coverImage:imageUrl}
        })
        if(!file) return null


        return new FileEntity(
            file.id,
            file.name,
            file.directoryId,
            file.published,
            file.url,
            file.content,
            file.coverImage,
            file.inTrash
        )
    }

}