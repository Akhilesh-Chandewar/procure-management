import { Schema, model, HydratedDocument } from 'mongoose'
import { IUser, IUserMethods } from './user.interface'
import bcrypt from 'bcrypt'

export type UserDocument = HydratedDocument<IUser, IUserMethods>

const userSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId
    },
    assignedTo: {
      type: Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
)

userSchema.index({ email: 1 }, { sparse: true, unique: true })
userSchema.index({ mobile: 1 }, { sparse: true, unique: true })
userSchema.index({ role: 1, isActive: 1 })
userSchema.index({ assignedTo: 1 })

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

export const UserModel = model<IUser>('User', userSchema, 'User')
