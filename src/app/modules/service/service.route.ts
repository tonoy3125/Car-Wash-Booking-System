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
      // Check if req.body.data exists and is a JSON string
      if (req.body?.data) {
        // console.log('Raw req.body.data:', req.body.data)

        // Attempt to parse the JSON data
        req.body = JSON.parse(req.body.data)
      }
      next()
    } catch (error) {
      console.error('JSON parsing error:', error)
      return res.status(400).json({
        success: false,
        message:
          'Invalid JSON format in data. Please ensure JSON is correctly formatted.',
        errorMessages: [
          {
            path: '',
            message: 'Invalid JSON format in data',
          },
        ],
      })
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
  upload,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body?.data) {
        console.log('Raw req.body.data:', req.body.data) // Debug
        req.body = JSON.parse(req.body.data)
      }
      console.log('Parsed req.body:', req.body) // Debug
      next()
    } catch (error) {
      console.error('JSON parsing error:', error)
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format in data.',
        errorMessages: [{ path: '', message: 'Invalid JSON format in data.' }],
      })
    }
  },
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService,
)

router.delete('/:id', auth(USER_ROLE.admin), ServiceControllers.deleteService)

export const ServiceRoutes = router
