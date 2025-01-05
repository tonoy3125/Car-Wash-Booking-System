import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { SlotValidations } from './slot.validation'
import { SlotControllers } from './slot.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(SlotValidations.createSlotValidationSchema),
  SlotControllers.createSlot,
)

router.patch(
  '/isBooked/:id',
  auth(USER_ROLE.admin), 
  validateRequest(SlotValidations.updateSlotStatusValidationSchema), 
  SlotControllers.updateSlotStatus, 
)

router.delete('/:id', auth(USER_ROLE.admin), SlotControllers.deleteSlot)

const router2 = express.Router()

router2.get('/', SlotControllers.getAvailableSlots)
router2.get('/service/:serviceId', SlotControllers.getSlotsByService)

export const SlotRoutes = router
export const SlotRoutes2 = router2
