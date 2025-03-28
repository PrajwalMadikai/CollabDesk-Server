import mongoose from "mongoose";
import { paymentModal } from "../database/models/PaymentModal";
import { UserModal } from "../database/models/userModal";
import { WorkspaceModal } from "../database/models/workspaceModal";
import { UserEntity } from "../entities/userEntity";
import { workspaceEnity } from "../entities/workspaceEntity";
import { workspaceInterface } from "../Repository-Interfaces/IWorkspace";

export class WorkspaceRepository implements workspaceInterface {
    async registeringSpace(name: string, ownerId: string, directories?: { Did: string; Dname: string; }[],
        userDetails?: { uId: string; email: string; }[], meetingRoom?: string,
        type?: string, trashId?: string | null): Promise<workspaceEnity | null> {

        const user = await UserModal.findById(ownerId);

        if (!user) {
            throw new Error("User not found");
        }

        const planType = user.paymentDetail.paymentType
        let workspaceLimit = 2;

        if (planType !== "Non") {
            const plan = await paymentModal.findOne({ paymentType: planType });
            if (!plan) {
                throw new Error("Subscription plan not found");
            }
            workspaceLimit = plan.WorkspaceNum;
        }
        if (user.workSpaces.length >= workspaceLimit) {
            throw new Error(`Workspace limit exceeded for ${planType} plan`);
        }


        const exists = await WorkspaceModal.findOne({ ownerId, name })
        if (exists) {
            return null
        }
        const space = await WorkspaceModal.create({ name, ownerId, directories, userDetails, meetingRoom, type, trashId })
        await UserModal.findOneAndUpdate(
            { _id: ownerId },
            {
                $push: { workSpaces: { workspaceId: space._id, workspaceName: space.name } }
            },
        );
        return new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.activity
        );
    }
    async userWorkspace(userId: string): Promise<UserEntity | null> {
        const user = await UserModal.findById(userId)


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
            user.googleId,
            user.avatar,
            user.githubId,
            user.role,
            user.isAdmin,
            user.isBlock
        )
    }

    async addCollaborator(email: string, workspaceId: string): Promise<workspaceEnity | null> {

        const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

        const user = await UserModal.findOne({ email })
        if (!user) {
            return null
        }

        const alreadyExist = await WorkspaceModal.findOne({
            _id: workspaceObjectId,
            userDetails: { $elemMatch: { userEmail: email } }
        })
        if (alreadyExist) {
            return null
        }


        let space = await WorkspaceModal.findByIdAndUpdate(workspaceObjectId,
            {
                $push: { userDetails: { userId: user.id, userEmail: email } }
            }, { new: true })
        if (!space) {
            return null
        }

        await UserModal.updateOne({ email }, {
            $push: { workSpaces: { workspaceId: space.id, workspaceName: space.name } }
        }, { new: true })



        return new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.activity
        );
    }
    async fetchAllcollaborators(workspaceId: string): Promise<workspaceEnity | null> {
        const space = await WorkspaceModal.findOne({ _id: new mongoose.Types.ObjectId(workspaceId) })
        if (!space) return null

        return new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.activity
        );
    }

    async renameSpacename(workspaceId: string, newName: string): Promise<workspaceEnity | null> {

        const space = await WorkspaceModal.findByIdAndUpdate(new mongoose.Types.ObjectId(workspaceId), {
            $set: { name: newName }
        }, { new: true })
        if (!space) return null
        await UserModal.updateMany(
            { "workSpaces.workspaceId": workspaceId },
            { $set: { "workSpaces.$.workspaceName": newName } }
        )
        return new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.activity
        );
    }
    async removeCollaborator(email: string, workspaceId: string): Promise<workspaceEnity | null> {
        const objectId = new mongoose.Types.ObjectId(workspaceId);

        const space = await WorkspaceModal.findByIdAndUpdate(
            objectId,
            {
                $pull: { userDetails: { userEmail: email } }
            },
            { new: true }
        );

        if (!space) return null;

        await UserModal.findOneAndUpdate(
            { email: email },
            {
                $pull: {
                    workSpaces: { workspaceId: workspaceId.toString() }
                }
            }
        );


        return new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.activity
        );
    }

    async deleteWorkspace(workspaceId: string): Promise<workspaceEnity | null> {
        const wId = new mongoose.Types.ObjectId(workspaceId)
        const space = await WorkspaceModal.findByIdAndDelete({ _id: wId })

        if (!space) return null;

        await UserModal.updateMany(
            { workSpaces: { $elemMatch: { workspaceId: space.id } } },
            { $pull: { workSpaces: { workspaceId: space.id } } }
        );

        return new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.activity
        );
    }
    async fetchActivity(workspaceId: string): Promise<workspaceEnity | null> {
        const space = await WorkspaceModal.findOne({ _id: new mongoose.Types.ObjectId(workspaceId) })

        if (!space) return null

        return new workspaceEnity(
            space.id,
            space.name,
            space.ownerId,
            space.directories,
            space.userDetails,
            space.activity
        );
    }
}