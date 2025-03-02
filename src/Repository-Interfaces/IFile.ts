import { DirectoryEntity } from "../entities/directoryEntity";
import { FileEntity } from "../entities/fileEntity";

export interface FileInterface{
    createFile(folderId:string):Promise<FileEntity | null>

    movetoTrash(fileId:string,folderId:string):Promise<DirectoryEntity|null>

    fetchFileContent(fileId:string):Promise<FileEntity|null>

    fetchFile(directoryId:string):Promise<DirectoryEntity|null>

    updateFileContent(fileId:string,content:string):Promise<FileEntity|null>

    updateFileName(fileId:string,folderId:string,name:string):Promise<FileEntity|null>

    uploadImage(fileId:string,imageUrl:string):Promise<FileEntity|null>

    restoreFile(fileId:string):Promise<FileEntity|null>

    makePublish(fileId:string):Promise<FileEntity|null>

    fetchPreview(fileId:string):Promise<FileEntity|null>
}