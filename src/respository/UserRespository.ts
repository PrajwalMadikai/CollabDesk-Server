import mongoose from "mongoose";
import { PaymentCollectionModal } from "../database/models/paymentCollectionModal";
import { paymentModal } from "../database/models/PaymentModal";
import { UserModal } from "../database/models/userModal";
import { AdminEntity } from "../entities/adminEntity";
import { PaymentEntity } from "../entities/paymentEntity";
import { UserEntity } from "../entities/userEntity";
import redisClient from "../presentation/utils/redisClient";
import { UserInterface } from "../Repository-Interfaces/IUser";

export class UserRepository implements UserInterface {
    async createUser(
        email: string,
        password: string,
        fullname: string,
        workSpaces: { workspaceId: string; workspaceName: string }[],
        paymentDetail: {
            paymentType: string;
            amount:number|null;
            startDate: Date;
            endDate: Date;
        },
        avatar: string | null,
        
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
            isAdmin:false,
            isBlock:false
        });

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );
    }

    async createGoogleUser(
        email: string,
        fullname: string,
        googleId: string|undefined,
        avatar: string|undefined ,
       
    ): Promise<UserEntity|null> {
        let user=await UserModal.findOne({ email })
        
        if(user)
        {
            return null
        }
         
        
         user = await UserModal.create({
            fullname,
            email,
            avatar,
            googleId,
            workSpaces:[],
            isBlock:false,
            paymentDetail:{
                paymentType:"Non",
                startDate:null,
                endDate:null
            }
        });

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );
    }

    async findByGoogleId(googleId: string): Promise<UserEntity | null> {
        let user = await UserModal.findOne({googleId});
        if (!user) {
            return null
        }
        

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );
    }
    async createGithubUser(githubId:string,data:UserEntity): Promise<UserEntity> {
        const name=data.email.split('@')[0]
        const user=await UserModal.create({
            fullname: name,
            email: data.email,
            workSpaces: data.workSpaces,
            paymentDetail:{
                paymentType:'Non',
                startDate:null,
                endDate:null
            },
            avatar: data.avatar,
            githubId: githubId,
            role:data.role,
            isBlock:data.isBlock,
        })

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
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
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
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
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
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
            users.avatar, 
            users.googleId, 
            users.githubId,
            users.role,
            users.isAdmin,
            users.isBlock
        ))
    }
     
    async updateUser(email: string, password: string): Promise<UserEntity|null> {

        const updatedUser=await UserModal.findOneAndUpdate(
            { email },  
            { $set: { password } },
        );
        if(!updatedUser)
            {
              return null
            }
        
            return new UserEntity(
                updatedUser.id,
                updatedUser.fullname,
                updatedUser.email,
                updatedUser.password,
                updatedUser.paymentDetail,
                updatedUser.workSpaces,
                updatedUser.avatar, 
                updatedUser.googleId, 
                updatedUser.githubId,
                updatedUser.role,
                updatedUser.isAdmin,
                updatedUser.isBlock
            );
        
    }
    async blockUser(userId: string): Promise<UserEntity | null> {
          const user=await UserModal.findByIdAndUpdate({_id:userId},{
            $set:{isBlock:true}
          })
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
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );

    }
    async unblockUser(userId: string): Promise<UserEntity | null> {
          const user=await UserModal.findByIdAndUpdate({_id:userId},{
            $set:{isBlock:false}
          })
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
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );

    }

    async verifyUser(userId:string):Promise<UserEntity|null>
    {
        const user=await UserModal.findById(userId)
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
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );
    }

    async fetchusers():Promise<UserEntity[]|null>
    {
        const users=await UserModal.find({isAdmin:false})
        if(!users)  return null
        return users.map((user)=>new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        ))
    }

    async updateuserName(userId:string,newName:string):Promise<UserEntity|null>{
        const user=await UserModal.findByIdAndUpdate(new mongoose.Types.ObjectId(userId),{
            $set:{fullname:newName}
        })
        if(!user) return null
        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );
    }
    async fetchPlanDetails(): Promise<PaymentEntity[] | null> {
        const plan=await paymentModal.find()
        if(!plan) return null

        return plan.map((plan)=>new PaymentEntity(
            plan.id,
            plan.paymentType,
            plan.amount,
            plan.FolderNum,
            plan.WorkspaceNum
        ))
    }
    async storePaymentDetails(email: string, paymentType: string, amount: number): Promise<UserEntity | null> {

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
    
        const user = await UserModal.findOneAndUpdate(
            { email },
            {
                $set: {
                    paymentDetail: {
                        paymentType,
                        amount:amount,
                        startDate: startDate,
                        endDate: endDate,
                    },
                },
            },
            { new: true } 
        );
    
        if (!user) {
            return null;
        }
        const subscriptionData = {
            userId: user.id,
            email: user.email,
            paymentType: paymentType,
            amount: amount,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };

        
        const currentTime = Math.floor(Date.now() / 1000); // time in seconds for redis ttl
        const ttlInSeconds = Math.floor(endDate.getTime() / 1000) - currentTime;

        await redisClient.set(
            `subscription:${user.id}`, 
            JSON.stringify(subscriptionData),  
            {
              EX: ttlInSeconds,  
            }
          );

        await PaymentCollectionModal.create({email,planType:paymentType,amount,status:'success',purchaseTime:Date.now()})

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );
    }
    async findUser(email:string):Promise<UserEntity|null>{
        const user=await UserModal.findOne({email})

        if(!user) return null

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        );
    }
    async getUserData(userId:string):Promise<UserEntity|null>{
        const user=await UserModal.findOne({_id:new mongoose.Types.ObjectId(userId)})
        if(!user) return null
        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
          );
    }
    async updateUseravatar(userId:string,imageUrl:string):Promise<UserEntity|null>{
        
        const user = await UserModal.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: { avatar: imageUrl } },
            { new: true }
          );

        
        if(!user) return null

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
          );
    }
    async changePassword(userId:string,password:string):Promise<UserEntity|null>{
        const user=await UserModal.findOneAndUpdate({_id:new mongoose.Types.ObjectId(userId)},
          {
            $set:{password}
          },{new:true})
          
       if(!user) return null

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
          );
    }
    async checkPassword(userId:string):Promise<UserEntity|null>
    {
        const user = await UserModal.findById(new mongoose.Types.ObjectId(userId))
        if(!user) return null

        return new UserEntity(
            user.id,
            user.fullname,
            user.email,
            user.password,
            user.paymentDetail,
            user.workSpaces,
            user.avatar, 
            user.googleId, 
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
          );
    }

}
