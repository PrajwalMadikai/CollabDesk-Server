import { FileRepository } from "../../respository/fileRepository";

export class FileUsecase{
    constructor(
        private fileRepository:FileRepository
    ){}

    async createFile(folderId:string){
        try {

            let result=await this.fileRepository.createFile(folderId)
            if(!result) return null 

            return result

        } catch (error) {
            console.log("error in file creation",error);
            return { status: 500, message: 'An error occurred during file creation.' }; 
        }
    }

}