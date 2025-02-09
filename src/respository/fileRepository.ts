import mongoose from "mongoose";
import { FolderModal } from "../database/models/directoryModal";
import { FileModal } from "../database/models/fileModal";
import { DirectoryEntity } from "../entities/directoryEntity";
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
}