import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { ServiceValidations } from './service.validation'
import { ServiceControllers } from './service.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.admin),
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

export const ServiceRoutes = router
