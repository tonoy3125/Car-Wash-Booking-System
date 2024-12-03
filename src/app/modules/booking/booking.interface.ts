import { Types } from 'mongoose'

export type TVehicleTypes =
  | 'car'
  | 'truck'
  | 'SUV'
  | 'van'
  | 'motorcycle'
  | 'bus'
  | 'electricVehicle'
  | 'hybridVehicle'
  | 'bicycle'
  | 'tractor'

export type TBooking = {
  customer: Types.ObjectId
  service: Types.ObjectId
  slot: Types.ObjectId
  vehicleType: TVehicleTypes
  vehicleBrand: string
  vehicleModel: string
  manufacturingYear: number
  registrationPlate: string
}
export type TBookingForReq = {
  serviceId: Types.ObjectId
  slotId: Types.ObjectId
  vehicleType: TVehicleTypes
  vehicleBrand: string
  vehicleModel: string
  manufacturingYear: number
  registrationPlate: string
  payment: 'paid' | 'pending'
}
