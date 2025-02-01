import { UserModal } from "../database/models/userModal";
import { AdminEntity } from "../entities/adminEntity";
import { UserEntity } from "../entities/userEntity";
import { UserInterface } from "../Repository-Interfaces/IUser";

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
        isAdmin:boolean
        
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
            isAdmin:false
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
            user.githubId,
            user.isAdmin
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
            user.githubId,
            user.isAdmin
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
            user.githubId,
            user.isAdmin
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
            user.githubId,
            user.isAdmin
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
            user.githubId,
            user.isAdmin
        );
    }

    async loginUser(email: string): Promise<UserEntity | null> {
        const user=await UserModal.findOne({email,isAdmin:false})
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
            user.githubId,
            user.isAdmin
        );
    }
    async loginAdmin(email: string): Promise<AdminEntity|null> {
        const admin=await UserModal.findOne({email,isAdmin:true})
        if(!admin)
        {
            return null
        }
        return new AdminEntity(
            admin.id,
            admin.email,
            admin.password,
            admin.isAdmin,
            admin.fullname
        )
    }
   async findAllUsers(): Promise<UserEntity[]|null> {
        const users=await UserModal.find({isAdmin:false})
        if(!users || users.length==0)
        {
            return null
        }
        return users.map((users)=>new UserEntity(
            users.id,
            users.fullname,
            users.email,
            users.password,
            users.paymentDetail,
            users.workSpaces,
            users.googleId,
            users.avatar,
            users.githubId,
            users.isAdmin
        ))
    }
}
