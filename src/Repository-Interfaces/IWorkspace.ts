import { workspaceEnity } from "../entities/workspaceEntity";

export interface workspaceInterface{
    createSpace(name:string,
        ownerId:string,
        directories:{Did:string,Dname:string}[],
        userDetails:{uId:string,email:string}[],
        meetingRoom:string,
        type:string,
        trashId:string|null,
    ):Promise<workspaceEnity|null>
}