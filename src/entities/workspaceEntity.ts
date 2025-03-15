export class workspaceEnity{
    id:string;
    name:string;
    ownerId:string;
    directories:{Did:string,Dname:string}[];
    userDetails:{uId:string,email:string}[];
    activity:{email:string,action:string,time:Date}[]
    constructor(
        id:string,
        name:string,
        ownerId:string,
        directories:{Did:string,Dname:string}[],
        userDetails:{uId:string,email:string}[],
        activity:{email:string,action:string,time:Date}[]
    )
    {
       
       this.id=id;
       this.name=name;
       this.ownerId=ownerId;
       this.directories=directories;
       this.userDetails=userDetails;
       this.activity=activity
    }
}