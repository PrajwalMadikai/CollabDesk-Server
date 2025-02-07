export class DirectoryEntity{
    name : string;
    workspaceId : string;
    files : { fileId:string , fileName:string }[];
    inTrash : boolean
    
    constructor(name:string,workspaceId:string,files:{fileId:string,fileName:string}[],inTrash:boolean)
    {
        this.name=name,
        this.workspaceId=workspaceId,
        this.files=files,
        this.inTrash=inTrash
    }
}