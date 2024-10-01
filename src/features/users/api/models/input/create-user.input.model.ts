import { IsEmail, IsString, Length } from "class-validator";

export class UserCreateModel {
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 10, {message: 'Количество знаков: 3-10'})
    login: string;

    @IsEmail({}, {message: 'Е-майл должен быть валидным'})
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
