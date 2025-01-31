import { WorkspaceRepository } from "../../respository/WorkspaceRepository";

export class WorkspaceUsecase{
    constructor(
        private workspaceRepo:WorkspaceRepository
    ){}

    async createSpace(
        name: string, ownerId: string,
    ){
        const space= await this.workspaceRepo.registeringSpace(name,ownerId)
        console.log('usecase:',space);
        if (!space) {
            return null;   
        }
        return space
    }

}