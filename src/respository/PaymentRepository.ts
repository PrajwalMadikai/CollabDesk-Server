import { PaymentCollectionModal } from "../database/models/paymentCollectionModal";
import { paymentModal } from "../database/models/PaymentModal";
import { PaymentEntity } from "../entities/paymentEntity";
import { PaymentInterface } from "../Repository-Interfaces/IPayment";

export class PaymentRepository implements PaymentInterface {

  async addPlan(paymentType: string, amount: number, FolderNum: number, WorkspaceNum: number): Promise<PaymentEntity | null> {

    const isExist = await paymentModal.findOne({ paymentType })
    if (isExist) return null

    const plan = await paymentModal.create({ paymentType, amount, FolderNum, WorkspaceNum })
    if (!plan) return null

    return new PaymentEntity(
      plan.id,
      plan.paymentType,
      plan.amount,
      plan.FolderNum,
      plan.WorkspaceNum
    )
  }

  async fetchPlans(): Promise<PaymentEntity[] | null> {

    const plan = await paymentModal.find()
    if (!plan) return null

    return plan.map((plan) => new PaymentEntity(
      plan.id,
      plan.paymentType,
      plan.amount,
      plan.FolderNum,
      plan.WorkspaceNum
    ))
  }
  async fetchPaymentPlans(startDate: string, endDate: string) {

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const matchStage = {
      status: 'success',
      purchaseTime: {
        $gte: start,
        $lte: end
      }
    };


    const stats = await PaymentCollectionModal.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: '$amount' } },
          activeSubscribers: { $sum: 1 }
        }
      }
    ]);

    return stats;

  }

  async fetchRevenueByDateRange(startDate: Date, endDate?: Date) {

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const matchStage = {
      status: 'success',
      purchaseTime: {
        $gte: start,
        $lte: end
      }
    };


    const result = await PaymentCollectionModal.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: '$amount' } }
        }
      }
    ]);

    return result[0]?.total || 0;

  }

  async fetchMonthlyStats(startDate: string, endDate: string): Promise<any> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const matchStage = {
      status: 'success',
      purchaseTime: {
        $gte: start,
        $lte: end
      }
    };

    const monthlyData = await PaymentCollectionModal.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          numericAmount: { $toDouble: "$amount" }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$purchaseTime' },
            year: { $year: '$purchaseTime' }
          },
          revenue: { $sum: "$numericAmount" },
          subscribers: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month"
                }
              }
            }
          },
          revenue: 1,
          subscribers: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    return monthlyData;
  }
  async fetchPlanDistribution(startDate: string, endDate: string): Promise<any> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const matchStage = {
      status: 'success',
      purchaseTime: {
        $gte: start,
        $lte: end
      }
    };

    const distribution = await PaymentCollectionModal.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          numericAmount: { $toDouble: "$amount" }
        }
      },
      {
        $group: {
          _id: '$planType',
          count: { $sum: 1 },
          revenue: { $sum: "$numericAmount" }
        }
      },
      {
        $project: {
          _id: 0,
          plan: '$_id',
          count: 1,
          revenue: 1
        }
      }
    ]);

    return distribution;
  }

  async deletePlan(type: string): Promise<PaymentEntity | null> {

    const plan = await paymentModal.findOne({ paymentType: type });

    if (!plan) {
      return null;
    }
    await paymentModal.deleteOne({ paymentType: type });

    return new PaymentEntity(
      plan.id,
      plan.paymentType,
      plan.amount,
      plan.FolderNum,
      plan.WorkspaceNum
    );
  }
}