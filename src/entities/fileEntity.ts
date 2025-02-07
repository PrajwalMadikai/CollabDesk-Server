export class FileEntity{
    name:string;
    directoryId:string;
    published:boolean;
    url:string;
    content:string;
    coverImage:string;
    inTrash:boolean;

    constructor( name:string, directoryId:string, published:boolean, url:string, content:string, coverImage:string, inTrash:boolean)
    {
        this.name=name;
        this.directoryId=directoryId;
        this.published=published;
        this.url=url;
        this.content=content;
        this.coverImage=coverImage;
        this.inTrash=inTrash;
    }
}