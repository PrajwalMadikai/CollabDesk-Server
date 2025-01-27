import { TokenModal } from "../database/models/tokenModal";
import { UserModal } from "../database/models/userModal";
import { EmailRepositoryInterface } from "../interfaces/IVerifyEmail";
interface TempUser {
    email: string;
    password: string;
    fullname: string;
    token: string;
    expiresAt: Date; 
    workSpaces?: { workspaceId: string; workspaceName: string }[];
    paymentDetail?: { paymentType: string; startDate: Date; endDate: Date } | null;
    googleId:string|null,
    avatar:string|null
}

export class EmailRepository implements EmailRepositoryInterface {
    async createTempUser(data: TempUser): Promise<void> {
        try {
            const formattedData = {
                ...data,
                expiresAt: data.expiresAt || new Date(Date.now() + 3600000),
                workSpaces: data.workSpaces || [],
                paymentDetail: data.paymentDetail || {
                    paymentType: "Non",
                    startDate: new Date(),
                    endDate: new Date(),
                },
            };
    
            const oldUser = await UserModal.findOne({ email: formattedData.email });
          
            
            if (oldUser) {
                console.log("Email already exists.");
                throw new Error("Email already exists!");  
            }
    
            const result = await TokenModal.create(formattedData);

        } catch (error) {
            console.error("Error creating Temp User:", error);
            throw error;  
        }
    }
    
    async findTempUser(email: string, token: string): Promise<TempUser | null> {
        const doc = await TokenModal.findOne({ email, token });
    
        if (doc) {
            const paymentDetail =
                doc.paymentDetail && typeof doc.paymentDetail === "object"
                    ? {
                          paymentType: doc.paymentDetail.paymentType ?? "",
                          startDate: doc.paymentDetail.startDate
                              ? new Date(doc.paymentDetail.startDate)
                              : new Date(),
                          endDate: doc.paymentDetail.endDate
                              ? new Date(doc.paymentDetail.endDate)
                              : new Date(),
                      }
                    : null;
    
            const tempUser: TempUser = {
                email: doc.email ?? "", 
                password: doc.password ?? "",
                fullname: doc.fullname ?? "",
                token: doc.token ?? "",
                expiresAt: doc.expiresAt ? new Date(doc.expiresAt) : new Date(), 
                workSpaces: doc.workSpaces ? doc.workSpaces.map(workspace => ({
                    workspaceId: workspace.workspaceId ?? "",
                    workspaceName: workspace.workspaceName ?? ""
                })) : [],
                paymentDetail: paymentDetail,
                googleId:null,
                avatar:null
            };
    
            return tempUser;
        }
    
        return null;
    }

    async deleteTempUser(email: string): Promise<void> {
        await TokenModal.deleteOne({ email });
    }
}
