export class FileEntity{
    id:string;
    name:string;
    directoryId:string;
    published:boolean;
    url:string;
    content:string;
    coverImage:string;
    inTrash:boolean;

    constructor(id:string, name:string, directoryId:string, published:boolean, url:string, content:string, coverImage:string, inTrash:boolean)
    {
        this.id=id;
        this.name=name;
        this.directoryId=directoryId;
        this.published=published;
        this.url=url;
        this.content=content;
        this.coverImage=coverImage;
        this.inTrash=inTrash;
    }
}