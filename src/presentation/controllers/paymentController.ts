import { NextFunction, Request, Response } from "express";
import { PaymentUsecase } from "../../applications/usecases/PaymentUsecase";
import { PAYMENT_MESSAGES } from "../messages/paymentMessages";

export class PaymentController {
  constructor(private paymentUsecase: PaymentUsecase) {}

  async addPaymentPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentType, amount, FolderNum, WorkspaceNum } = req.body;

      if (!paymentType || !amount || !FolderNum || !WorkspaceNum) {
        return res.status(400).json({ message: PAYMENT_MESSAGES.ERROR.MISSING_PARAMS });
      }

      const data = await this.paymentUsecase.paymentPlan(paymentType, amount, FolderNum, WorkspaceNum);
      if (!data) {
        return res.status(404).json({ message: PAYMENT_MESSAGES.ERROR.UNABLE_TO_ADD_PLAN });
      }

      return res.status(201).json({ message: PAYMENT_MESSAGES.SUCCESS.PAYMENT_PLAN_ADDED, data });
    } catch (error) {
      next(error);
    }
  }

  async fetchPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.paymentUsecase.fetchPlans();
      if (!data) {
        return res.status(404).json({ message: PAYMENT_MESSAGES.ERROR.NO_PLANS_FOUND });
      }

      return res.status(200).json({ message: PAYMENT_MESSAGES.SUCCESS.PLANS_FETCHED, data });
    } catch (error) {
      next(error);
    }
  }

  async payment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userData } = req.body;

      if (!userData) {
        return res.status(400).json({ message: PAYMENT_MESSAGES.ERROR.MISSING_BODY_DATA });
      }

      const amount = userData.amount / 100;

      const data = await this.paymentUsecase.storePaymentDetails(userData.email, userData.paymentType, amount);
      if (!data) {
        return res.status(404).json({ message: PAYMENT_MESSAGES.ERROR.UNABLE_TO_STORE_PAYMENT });
      }

      return res.status(200).json({ message: PAYMENT_MESSAGES.SUCCESS.PAYMENT_INFO_STORED });
    } catch (error) {
      next(error);
    }
  }

  async paymentStates(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: PAYMENT_MESSAGES.ERROR.MISSING_DATES });
      }

      const data = await this.paymentUsecase.fetchPaymentStats(startDate as string, endDate as string);
      if (!data) {
        return res.status(404).json({ message: PAYMENT_MESSAGES.ERROR.UNABLE_TO_FETCH_STATS });
      }

      return res.status(200).json({ message: PAYMENT_MESSAGES.SUCCESS.PAYMENT_STATS_FETCHED, data });
    } catch (error) {
      next(error);
    }
  }

  async monthlyPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: PAYMENT_MESSAGES.ERROR.MISSING_DATES });
      }

      const data = await this.paymentUsecase.fetchMonthlyStats(startDate as string, endDate as string);
      if (!data) {
        return res.status(404).json({ message: PAYMENT_MESSAGES.ERROR.UNABLE_TO_FETCH_MONTHLY_STATS });
      }

      return res.status(200).json({ message: PAYMENT_MESSAGES.SUCCESS.MONTHLY_PAYMENTS_FETCHED, data });
    } catch (error) {
      next(error);
    }
  }

  async planDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: PAYMENT_MESSAGES.ERROR.MISSING_DATES });
      }

      const data = await this.paymentUsecase.planDistribution(startDate as string, endDate as string);
      if (!data) {
        return res.status(404).json({ message: PAYMENT_MESSAGES.ERROR.UNABLE_TO_FETCH_PLAN_DISTRIBUTION });
      }

      return res.status(200).json({ message: PAYMENT_MESSAGES.SUCCESS.PLAN_DISTRIBUTION_FETCHED, data });
    } catch (error) {
      next(error);
    }
  }

  async planDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;

      if (!type) {
        return res.status(400).json({ message: PAYMENT_MESSAGES.ERROR.MISSING_TYPE });
      }

      const data = await this.paymentUsecase.deletePlan(type);
      if (!data) {
        return res.status(404).json({ message: PAYMENT_MESSAGES.ERROR.UNABLE_TO_DELETE_PLAN });
      }

      return res.status(200).json({ message: PAYMENT_MESSAGES.SUCCESS.PLAN_DELETED });
    } catch (error) {
      next(error);
    }
  }
}