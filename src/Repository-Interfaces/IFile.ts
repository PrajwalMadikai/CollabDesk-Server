import { DirectoryEntity } from "../entities/directoryEntity";

export interface FileInterface{
    createFile(folderId:string,name:string):Promise<DirectoryEntity | null>
}