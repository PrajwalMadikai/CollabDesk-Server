import express, { NextFunction, Request, Response } from 'express'
import { TokenService } from '../../applications/services/TokenService'
import { PaymentUsecase } from '../../applications/usecases/PaymentUsecase'
import { UserRole } from '../../interface/roles'
import { PaymentRepository } from '../../respository/PaymentRepository'
import { PaymentController } from '../controllers/paymentController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'
import asyncHandler from '../utils/errorHandler'

const router = express.Router()

const paymentRepository = new PaymentRepository()
const paymentUsecase = new PaymentUsecase(paymentRepository)
const paymentController = new PaymentController(paymentUsecase)

// public: pricing page reads plans without being logged in
router.get('/plans', asyncHandler(paymentController.fetchPlans.bind(paymentController)))

// user: record a completed payment (e.g. after Stripe checkout)
router.post('/payment-details', authenticateToken, authorizeRoles(UserRole.USER),
  (req: Request, res: Response, next: NextFunction) => { paymentController.payment(req, res, next) })

// admin: plan management & revenue stats
router.post('/admin/payment-plan', authenticateToken, authorizeRoles(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => { paymentController.addPaymentPlan(req, res, next) })

router.get('/admin/fetch-plans', authenticateToken, authorizeRoles(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => { paymentController.fetchPlans(req, res, next) })

router.get('/admin/payment-stats', authenticateToken, authorizeRoles(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => { paymentController.paymentStates(req, res, next) })

router.get('/admin/monthly-payments', authenticateToken, authorizeRoles(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => { paymentController.monthlyPayments(req, res, next) })

router.get('/admin/plan-distribution', authenticateToken, authorizeRoles(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => { paymentController.planDistribution(req, res, next) })

router.delete('/admin/payment-plan/:type', authenticateToken, authorizeRoles(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => { paymentController.planDelete(req, res, next) })

export default router
