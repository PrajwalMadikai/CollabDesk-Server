import { DirectoryEntity } from "../entities/directoryEntity";

export interface FileInterface{
    createFile(folderId:string):Promise<DirectoryEntity | null>

    deleteFile(fileId:string,folderId:string):Promise<DirectoryEntity|null>
}