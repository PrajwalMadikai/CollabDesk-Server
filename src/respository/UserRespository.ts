import { UserModal } from "../database/models/userModal";
import { UserEntity } from "../entities/userEntity";
import { UserInterface } from "../interfaces/IUser";

export class UserRepository implements UserInterface {
    async createUser(
        email: string,
        password: string,
        fullname: string,
        workSpaces: { workspaceId: string; workspaceName: string }[],
        paymentDetail: {
            paymentType: string;
            startDate: Date;
            endDate: Date;
        },
        avatar: string | null,
        googleId: string | null
    ): Promise<UserEntity | { error: string }> {

        const oldUser = await UserModal.findOne({ email });
        if (oldUser) {
            console.log("already exists");
            return { error: "Email already exists!." };
        }

        const user = await UserModal.create({
            fullname,
            email,
            password,
            workSpaces,
            paymentDetail,
            avatar,
            googleId,
        });

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workspace,
            user.googleId,
            user.avatar
        );
    }

    async createGoogleUser(
        email: string,
        fullname: string,
        googleId: string|undefined,
        avatar: string|undefined 
    ): Promise<UserEntity> {
        console.log('full name:',fullname);
        
        const user = await UserModal.create({
            fullname,
            email,
            avatar,
            googleId,
        });

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workspace,
            user.googleId,
            user.avatar
        );
    }

    async findByGoogleId(googleId: string): Promise<UserEntity | null> {
        const user = await UserModal.findOne({googleId});
        if (!user) {
            return null;
        }

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workspace,
            user.googleId,
            user.avatar
        );
    }
}
