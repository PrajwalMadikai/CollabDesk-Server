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
        }
    ): Promise<UserEntity | { error: string }> {

        const oldUser=await UserModal.findOne({email})
        if(oldUser)
        {
            console.log('already exists');
            
            return { error: "Email already exists!." };
        }
    
        const user = await UserModal.create({
            fullname,
            email,
            password,
            workSpaces, 
            paymentDetail,
        });

        return new UserEntity(user.id,user.fullname,user.email,user.password,user.paymentDetail,user.workspace);
    }

    
}
