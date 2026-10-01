export class AdminEntity {
    email: string;
    password: string;
    fullname: string;
    isAdmin:boolean
    id: string;

    constructor(
        id:string,
        email: string,
        password: string,
        isAdmin:boolean,
        fullname: string
    ) {
        this.id=id
        this.email = email;
        this.password = password;
        this.isAdmin=isAdmin
        this.fullname=fullname
    }
}
