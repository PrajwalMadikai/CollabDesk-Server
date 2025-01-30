interface TempUser {
    email: string;
    password: string;
    fullname: string;
    token: string;
    expiresAt: Date;
    workSpaces?: { workspaceId: string; workspaceName: string }[]; 
    paymentDetail?: { paymentType: string; startDate: Date; endDate: Date } | null; // Nullable
}

export interface EmailRepositoryInterface {
    createTempUser(data: TempUser): Promise<void>;
    findTempUser(email: string, token: string): Promise<TempUser | null>;
    deleteTempUser(email: string): Promise<void>;
}
