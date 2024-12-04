import mongoose, { Schema } from 'mongoose'
import { IPayment } from './payment.interface'

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    booking: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    // status: { type: String, required: true, default: 'paid' },
  },
  { timestamps: true },
)

const Payment = mongoose.model('Payment', PaymentSchema)

export default Payment
