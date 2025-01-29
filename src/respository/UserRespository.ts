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
        googleId: string | null,
        githubId:string|null
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
            githubId
        });

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.googleId,
            user.avatar,
            user.githubId
        );
    }

    async createGoogleUser(
        email: string,
        fullname: string,
        googleId: string|undefined,
        avatar: string|undefined ,
       
    ): Promise<UserEntity> {
        
        const user = await UserModal.create({
            fullname,
            email,
            avatar,
            googleId,
            workSpaces:[]
        });

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.googleId,
            user.avatar,
            user.githubId
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
            user.workSpaces,
            user.googleId,
            user.avatar,
            user.githubId
        );
    }
    async createGithubUser(githubId:string,data:UserEntity): Promise<UserEntity> {
        const user=await UserModal.create({
            fullname: data.fullname,
            email: data.email,
            workSpaces: data.workSpaces,
            paymentDetail: data.paymentDetail,
            avatar: data.avatar,
            githubId: githubId,
        })

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.googleId,
            user.avatar,
            user.githubId
        );
    }

    async getUserByGithubId(githubId: string): Promise<UserEntity | null> {
        const user = await UserModal.findOne({ githubId });
        if (!user) return null;

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.googleId,
            user.avatar,
            user.githubId
        );
    }

    async loginUser(email: string): Promise<UserEntity | null> {
        const user=await UserModal.findOne({email})
        if(!user)
        {
             return null
        }
        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.googleId,
            user.avatar,
            user.githubId
        );
    }
}
