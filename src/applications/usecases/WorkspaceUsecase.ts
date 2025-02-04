import { UserRepository } from "../../respository/UserRespository";
import { WorkspaceRepository } from "../../respository/WorkspaceRepository";

export class WorkspaceUsecase{
    constructor(
        private workspaceRepo:WorkspaceRepository,
        private userRepository:UserRepository
    ){}

    async createSpace(
        name: string, ownerId: string,
    ){
        const space= await this.workspaceRepo.registeringSpace(name,ownerId)
        if (!space) {
            return null;   
        }
       await this.userRepository.insertWorkspace(space.ownerId,space.name,space.id)
       
        console.log('usecase:',space);
        return space
    }

}