import { NextFunction, Response } from "express";
import { UserModal } from "../../database/models/userModal";
import redisClient from "../utils/redisClient";
import { AuthenticatedRequest } from "./authMiddleware";

const checkSubscription = async (req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> => {
    const userId = req.user?.userId; 
    try {
        const subscriptionData = await redisClient.get(`subscription:${userId}`);

        if (!subscriptionData) {
            const user = await UserModal.findById(userId).select('paymentDetail');
            if (!user || !user.paymentDetail) {
                 res.status(404).json({ message: 'user not found or user deosnt have payment detail field' });
                 return
            }

            const paymentType = user.paymentDetail.paymentType;

            if (paymentType === 'Non') {
                return next();
            }
            res.status(403).json({ message: 'Subscription expired. Please renew your subscription.' });
            return
          
        } else {
            const parsedData = JSON.parse(subscriptionData);


            const endDate = new Date(parsedData.endDate);
            if (endDate < new Date()) {
                
                 res.status(403).json({ message: 'Subscription expired. Please renew your subscription.' });
                 return
            }
        }

        next();
    } catch (error) {
        console.error('Error checking subscription:', error);
        res.status(500).json({ message: 'An error occurred while checking subscription.' });
        return
    }
};

export default checkSubscription