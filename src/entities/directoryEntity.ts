export class DirectoryEntity{
    id:string;
    name : string;
    workspaceId : string;
    files : { fileId:string , fileName:string }[];
    inTrash : boolean
    
    constructor(id:string,name:string,workspaceId:string,files:{fileId:string,fileName:string}[],inTrash:boolean)
    {
        this.id=id,
        this.name=name,
        this.workspaceId=workspaceId,
        this.files=files,
        this.inTrash=inTrash
    }
}