import { TokenModal } from "../database/models/tokenModal";
import { UserModal } from "../database/models/userModal";
import { emailCheck } from "../interface/emailverify";
import { EmailRepositoryInterface } from "../Repository-Interfaces/IVerifyEmail";
interface TempUser {
    email: string;
    password: string;
    fullname: string;
    token: string;
    expiresAt: Date; 
    workSpaces?: { workspaceId: string; workspaceName: string }[];
    paymentDetail?: { paymentType: string;amount:number|null; startDate: Date; endDate: Date } | null;
    avatar:string|null,
    isAdmin:boolean,
    isBlock:boolean
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
                    amount:null,
                    startDate: new Date(),
                    endDate: new Date(),
                },
                avatar:null,
                isAdmin:data.isAdmin,
                isBlock:data.isBlock
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
                          amount:null,
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
               avatar:null,
               isAdmin:false,
               isBlock:false
            };
    
            return tempUser;
        }
    
        return null;
    }

    async deleteTempUser(email: string): Promise<void> {
        await TokenModal.deleteOne({ email });
    }
   
    async createEmailSpace(email: string, token: string): Promise<void> {
        try {
            const temp=await TokenModal.create({email,token,expiresAt:new Date(Date.now() + 3600000)})

        } catch (error) {
            console.error("Error creating Temp User:", error);
            throw error
        }
        
    }

    async findVerifiedUser(email: string, token: string): Promise<emailCheck|null> {
        try {

            let user=await TokenModal.findOne({email,token})
            if(!user) return null
            
            return {
                email: user.email || "",  
                token: user.token || "", 
            };
            
        } catch (error) {
            console.error("Error creating Temp User:", error);
            throw error
        }
    }

}
