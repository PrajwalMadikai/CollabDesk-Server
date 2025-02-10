import { DirectoryEntity } from "../entities/directoryEntity";
import { FileEntity } from "../entities/fileEntity";

export interface FileInterface{
    createFile(folderId:string):Promise<DirectoryEntity | null>

    deleteFile(fileId:string,folderId:string):Promise<DirectoryEntity|null>

    fetchFileContent(fileId:string):Promise<FileEntity|null>
}