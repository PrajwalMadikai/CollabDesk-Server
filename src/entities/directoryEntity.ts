export class DirectoryEntity{
    id:string;
    name : string;
    workspaceId : string;
    files : { fileId:string , fileName:string }[];
    inTrash : boolean
    deletedAt:Date|null
    
    constructor(id:string,name:string,workspaceId:string,files:{fileId:string,fileName:string}[],inTrash:boolean,deletedAt:Date|null)
    {
        this.id=id,
        this.name=name,
        this.workspaceId=workspaceId,
        this.files=files,
        this.inTrash=inTrash,
        this.deletedAt=deletedAt
    }
}