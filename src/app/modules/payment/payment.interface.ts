import { Types } from 'mongoose'

export interface IPayment {
  customer: Types.ObjectId
  booking: Types.ObjectId[]
  amount: number
  transactionId: string
  status?: string
}
export interface IPaymentPayload {
  amount: number
  cus_name: string
  cus_email: string
  cus_phone: number
  cus_add: string
  tran_id: string
  customer: string
}

export interface IPaymentTokenInfo {
  transactionId: string
  customer: string
  amount: number
}
