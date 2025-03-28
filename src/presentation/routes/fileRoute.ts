import express, { NextFunction, Request, Response } from 'express'
import { CloudinaryAdapter } from '../../applications/services/CloudinaryService'
import { MulterService } from '../../applications/services/MulterService'
import { FileUsecase } from '../../applications/usecases/FileUsecase'
import { UserRole } from '../../interface/roles'
import { FileRepository } from '../../respository/fileRepository'
import { FileController } from '../controllers/fileController'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'
import { checkUserBlockStatus } from '../middleware/checkUserBlock'
import checkSubscription from '../middleware/redisPaymentExpireMiddleware'

const router = express.Router()

const fileRepository = new FileRepository()
const multerService = new MulterService()
const cloudinaryService = new CloudinaryAdapter()

const fileUsecase = new FileUsecase(fileRepository, cloudinaryService)

const fileController = new FileController(fileUsecase)



router.post('/create', authenticateToken, checkUserBlockStatus, authorizeRoles(UserRole.USER), checkSubscription,
    (req: Request, res: Response, next: NextFunction) => { fileController.createFiles(req, res, next) })

router.post('/move-to-trash', authenticateToken, checkUserBlockStatus, authorizeRoles(UserRole.USER),
    (req: Request, res: Response, next: NextFunction) => { fileController.movetoTrash(req, res, next) })

router.post('/fetch', authenticateToken, checkUserBlockStatus, authorizeRoles(UserRole.USER),
    (req: Request, res: Response, next: NextFunction) => { fileController.fetchFile(req, res, next) })

router.get('/:fileId', authenticateToken, checkUserBlockStatus, authorizeRoles(UserRole.USER),
    (req: Request, res: Response, next: NextFunction) => { fileController.contentFetch(req, res, next) })

router.put('/update/:fileId', authenticateToken, checkUserBlockStatus, authorizeRoles(UserRole.USER),
    (req: Request, res: Response, next: NextFunction) => { fileController.updateFileName(req, res, next) })

router.put('/uploadImage/:fileId', authenticateToken, checkUserBlockStatus, authorizeRoles(UserRole.USER),
    multerService.single("image"), (req: Request, res: Response, next: NextFunction) => { fileController.uploadImage(req, res, next) })

router.post('/restore', authenticateToken, checkUserBlockStatus, authorizeRoles(UserRole.USER),
    (req: Request, res: Response, next: NextFunction) => { fileController.fileRestore(req, res, next) })

router.post('/publish/:fileId', authenticateToken, checkUserBlockStatus, authorizeRoles(UserRole.USER),
    (req: Request, res: Response, next: NextFunction) => { fileController.makeDocOnline(req, res, next) })

// unprotected route
router.get('/preview/:fileId', (req: Request, res: Response, next: NextFunction) => { fileController.getFileReview(req, res, next) })

export default router