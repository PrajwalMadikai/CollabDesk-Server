import cron from 'node-cron';
import { FileModal } from '../../database/models/fileModal';

export const setupDeleteExpiredFilesCron = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            const now = new Date();
            
            const expiredFiles = await FileModal.find({
                inTrash: true,
                scheduledForDeletion: { $lte: now }
            });

            for (const file of expiredFiles) {
                await FileModal.deleteOne({ _id: file._id });
            }

           
        } catch (error) {
            console.error('Error in delete expired files cron job:', error);
        }
    });
};