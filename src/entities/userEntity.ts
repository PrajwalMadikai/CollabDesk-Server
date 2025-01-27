export class UserEntity {
    id: string;
    email: string;
    password?: string;
    fullname: string;
    paymentDetail?: {
        paymentType: string;
        startDate: Date;
        endDate: Date;
    };
    workSpaces?: { workspaceId: string; workspaceName: string }[];
    googleId?: string|null;
    avatar?:string|null;
    githubId?:string

    constructor(
        id: string,
        fullname: string,
        email: string,
        password: string,
        paymentDetail: {
            paymentType: string;
            startDate: Date;
            endDate: Date;
        },
        workSpaces: { workspaceId: string; workspaceName: string }[],
        avatar:string,
        googleId:string,
        githubId:string
    ) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.paymentDetail = paymentDetail; 
        this.workSpaces = workSpaces;
        this.googleId=googleId
        this.avatar=avatar
        this.githubId=githubId
    }
}
