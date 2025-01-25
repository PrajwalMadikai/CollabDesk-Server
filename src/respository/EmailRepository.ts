import { TokenModal } from "../database/models/tokenModal";
import { EmailRepositoryInterface } from "../interfaces/IVerifyEmail";

interface TempUser {
    email: string;
    password: string;
    fullname: string;
    token: string;
    expiresAt: Date;
    workSpaces?: { workspaceId: string; workspaceName: string }[]; // Optional
    paymentDetail?: { paymentType: string; startDate: Date; endDate: Date } | null; // Nullable
}

export class EmailRepository implements EmailRepositoryInterface {
    async createTempUser(data: TempUser): Promise<void> {
        await TokenModal.create(data);
    }

    async findTempUser(email: string, token: string): Promise<TempUser | null> {

        const doc = await TokenModal.findOne({ email, token });

        if (doc) {
            const tempUser: TempUser = {
                email: doc.email,
                password: doc.password,
                fullname: doc.fullname,
                token: doc.token,
                expiresAt: doc.expiresAt,
                workSpaces: doc.workSpaces || [],
                paymentDetail: doc.paymentDetail || null,
            };

            return tempUser;
        }

        return null;
    }

    async deleteTempUser(email: string): Promise<void> {
        await TokenModal.deleteOne({ email });
    }
}
