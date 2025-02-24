export class FileEntity{
    id:string;
    name:string;
    directoryId:string;
    published:boolean;
    url:string;
    content:string;
    coverImage:string;
    inTrash:boolean;
    deletedAt:Date|null
    constructor(id:string, name:string, directoryId:string, published:boolean, url:string, content:string, coverImage:string, inTrash:boolean,deletedAt:Date|null)
    {
        this.id=id;
        this.name=name;
        this.directoryId=directoryId;
        this.published=published;
        this.url=url;
        this.content=content;
        this.coverImage=coverImage;
        this.inTrash=inTrash;
        this.deletedAt=deletedAt
    }
}