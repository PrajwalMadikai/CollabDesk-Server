import { emailCheck } from "../interface/emailverify";

interface TempUser {
    email: string;
    password: string;
    fullname: string;
    token: string;
    expiresAt: Date;
    workSpaces?: { workspaceId: string; workspaceName: string }[]; 
    paymentDetail?: { paymentType: string; startDate: Date|null; endDate: Date|null } | null;  
}

export interface EmailRepositoryInterface {
    createTempUser(data: TempUser): Promise<void>;
    findTempUser(email: string, token: string): Promise<TempUser | null>;
    deleteTempUser(email: string): Promise<void>;
    createEmailSpace(email:string,token:string):Promise<void>
    findVerifiedUser(email:string,token:string):Promise<emailCheck|null>
}
