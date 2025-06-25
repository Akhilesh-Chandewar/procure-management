import { Types } from 'mongoose'
import { UserRole } from '../../constants/constants'

export interface IUser {
  _id: Types.ObjectId
  email?: string
  mobile?: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
  isActive: boolean
  createdBy?: Types.ObjectId
  assignedTo?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>
}

export interface CreateUserInput extends Partial<IUser> {
  email: string
  mobile: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  createdBy?: Types.ObjectId
  assignedTo?: Types.ObjectId
}

export interface LoginInput extends Partial<IUser> {
  email?: string
  mobile?: string
  password: string
}