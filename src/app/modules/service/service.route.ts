import express, { NextFunction, Request, Response } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { ServiceValidations } from './service.validation'
import { ServiceControllers } from './service.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.admin),
  upload, // Multer middleware for single image upload
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the form-data body sent as JSON
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data)
      }
      next()
    } catch (error) {
      next(error)
    }
  },
  validateRequest(ServiceValidations.createServiceValidationSchema),
  ServiceControllers.createService,
)

router.get('/:id', ServiceControllers.getSingleService)
router.get('/', ServiceControllers.getAllService)

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService,
)

router.delete('/:id', auth(USER_ROLE.admin), ServiceControllers.deleteService)

export const ServiceRoutes = router
