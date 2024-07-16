import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { SlotValidations } from './slot.validation'
import { SlotControllers } from './slot.controller'

const router = express.Router()

router.post(
  '/',

  validateRequest(SlotValidations.createSlotValidationSchema),
  SlotControllers.createSlot,
)

export const SlotRoutes = router
