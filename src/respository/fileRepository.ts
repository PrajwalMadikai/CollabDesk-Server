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
        console.log('file content fetch:',file)
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
        console.log(
            'file:',files
        );
        
        return  new DirectoryEntity(
            files.id,
            files.name,
            files.workspaceId,
            files.files,
            files.inTrash
         )
    }
}