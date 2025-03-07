import { Liveblocks } from "@liveblocks/node";
import cron from 'node-cron';
import { FolderModal } from '../../database/models/directoryModal';
import { FileModal } from '../../database/models/fileModal';

const liveblocks=new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY as string
})

export const setupDeleteExpiredFilesCron = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            const now = new Date();
            
            const expiredFiles = await FileModal.find({
                inTrash: true,
                deletedAt: { $lte: now }
            });

            for (const file of expiredFiles) {
                await FileModal.deleteOne({ _id: file._id });
                await liveblocks.deleteRoom(file._id as string)
            }

           
        } catch (error) {
            console.error('Error in delete expired files cron job:', error);
        }
    });
};

export const handleFolderRemoveCronjobs=()=>{
    cron.schedule('0 0 * * *',async()=>{
        try {
            const now=new Date()

            const expireFolder=await FolderModal.find({
                inTrash:true,
                deletedAt:{$lte:now}
            })
            for(const folder of expireFolder){
                await FolderModal.deleteOne({_id:folder._id})
            }
            
        } catch (error) {
            console.error('Error in delete expired folder cron job:', error);
        }
    })
}

// */2 * * * *