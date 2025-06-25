import { UserModel } from './user.model'
import { CreateUserInput } from './user.interface'
import { config } from '../../config/config'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import bcrypt from 'bcrypt'


export class UserService {
  public async create(input: CreateUserInput) {
    const user = await UserModel.create(input)
    return user
  }

  public async getById(id: Types.ObjectId) {
    return UserModel.findById(id).exec()
  }

  public async getByEmail(email: CreateUserInput) {
    return UserModel.findOne({ email }).exec()
  }

  public async getByMobile(mobile: CreateUserInput) {
    return UserModel.findOne({ mobile }).exec()
  }

  public async update(id: Types.ObjectId, data: Partial<CreateUserInput>) {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).exec()
  }

  public async filter(data: Partial<CreateUserInput>) {
    return UserModel.find(data).exec()
  }

  public  genrateAccessToken(id : Types.ObjectId) {
    return  jwt.sign({ id: id }, config.ACCESS_TOKEN_KEY!, {
      expiresIn: '1d'
    })
  }

  public genrateRefreshToken(id: Types.ObjectId) {
    return jwt.sign({ id: id }, config.REFRESH_TOKEN_KEY!, {
      expiresIn: '7d'
    })
  }

  public async comparePassword (userPassword: string, userHashedPassword: string): Promise<boolean> {
    return bcrypt.compare(userPassword, userHashedPassword)
  }
}

export const userService = new UserService()
