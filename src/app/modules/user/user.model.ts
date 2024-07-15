import { model, Schema } from 'mongoose'
import { TUser, UserModel } from './user.interface'

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    phone: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// User Statics Method isExistsByEmail
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password')
}

export const User = model<TUser, UserModel>('User', userSchema)
