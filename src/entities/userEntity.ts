export class UserEntity {
    id: string;
    email: string;
    password: string;
    fullname: string;
    paymentDetail: {
        paymentType: string;
        startDate: Date;
        endDate: Date;
    };
    workSpaces: { workspaceId: string; workspaceName: string }[];

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
        workSpaces: { workspaceId: string; workspaceName: string }[]
    ) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.paymentDetail = paymentDetail; 
        this.workSpaces = workSpaces;
    }
}
