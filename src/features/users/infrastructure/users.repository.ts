import { Injectable, NotFoundException } from "@nestjs/common";
import { HydratedDocument, Model } from "mongoose";
import {User} from "../domain/users.entity";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class UsersRepository {
    constructor(
      @InjectModel("User") private userModel: Model<User>,
    ) {
    }

    async saveBlog(user: HydratedDocument<User>) {
        const saveUser = await user.save()
        return saveUser
    }

    async findUserByLogin(loginValue: string) {
        const findedUser = await this.userModel.findOne({login: loginValue})
        if (!findedUser) {
            throw new NotFoundException("User not found")
        }
        return findedUser
    }

    async findUserByEmail(emailValue: string) {
        const findedUser = await this.userModel.findOne({email: emailValue})
        if (!findedUser) {
            throw new NotFoundException("User not found")
        }
        return findedUser
    }

    async findUserByCode(code: string) {
        const findedUser = await this.userModel.findOne({"emailConfirmation.confirmationCode": code})
        if (!findedUser) {
            throw new NotFoundException("User not found")
        }
        return findedUser
    }

    async checkUserStatus(emailValue: string) {
        const findedUser = await this.findUserByEmail(emailValue)
        if (findedUser.emailConfirmation.isConfirmed) {
            throw new NotFoundException("User already confirmed")
        }
        return true
    }

    async checkCodeStatus(code: string) {
        // const findedUser = await this.userModel.findOne({ "emailConfirmation.confirmationCode": code });
        const findedUser = await this.findUserByCode(code);
        // if (!findedUser) {
        //     throw new NotFoundException("User not found")
        // }
        if (findedUser.emailConfirmation.isConfirmed) {
            throw new NotFoundException("User already confirmed")
        }
        return findedUser
    }

}
