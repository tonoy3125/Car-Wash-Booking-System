import { IPayment } from './payment.interface'
import Payment from './payment.model'

const createPaymentIntoDB = async (paymentData: IPayment) => {
  const payment = new Payment(paymentData)
  return await payment.save()
}

export const PaymentServices = {
  createPaymentIntoDB,
}
