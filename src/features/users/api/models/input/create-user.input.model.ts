import { IsEmail, IsString, Length } from "class-validator";
import { LoginExists } from "../../../../../infrastructure/decorators/login-is-exist.decorator";
import { EmailExists } from "../../../../../infrastructure/decorators/email-is-exist.decorator";

export class UserCreateModel {
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 10, {message: 'Количество знаков: 3-10'})
    @LoginExists()
    login: string;

    @IsEmail({}, {message: 'Е-майл должен быть валидным'})
    @EmailExists()
    email: string;

    @IsString({message: 'Должно быть строкой'})
    @Length(6, 20, {message: 'Количество знаков: 6-20'})
    password: string;
}

export class EmailConfirmationModel {
    confirmationCode?: string
    expirationDate?: string
    isConfirmed: boolean
}
