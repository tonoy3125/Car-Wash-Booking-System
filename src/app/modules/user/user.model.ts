import { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { TUser, UserModel } from './user.interface'
import config from '../../config'

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

// Password Hashing before saving data in DB
userSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook : we will save data');
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  // Hashing Password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

// Password hide from response data
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

// User Statics Method isExistsByEmail
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password')
}

// Password Match Statics Method
userSchema.statics.isPasswordMatch = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

export const User = model<TUser, UserModel>('User', userSchema)
