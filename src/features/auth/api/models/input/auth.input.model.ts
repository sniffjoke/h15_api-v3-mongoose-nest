import { IsEmail, IsString, Length } from "class-validator";
import { CheckEmailStatus } from "../../../../../infrastructure/decorators/check-email-status.decorator";
import { CheckCodeStatus } from "../../../../../infrastructure/decorators/check-code-status.decorator";
import { CodeExists } from "../../../../../infrastructure/decorators/code-is-exist.decorator";

export class LoginDto {
  @IsString({message: 'Должно быть строковым значением'})
  @Length(3, 10, {message: 'Количество знаков: 3-10'})
  loginOrEmail: string;

  @IsString({message: 'Должно быть строковым значением'})
  @Length(6, 20, {message: 'Количество знаков: 6-20'})
  password: string;
}

export class ActivateAccountDto {
  @IsString({message: 'Должно быть строковым значением'})
  @CodeExists()
  @CheckCodeStatus()
  code: string
}

export class ResendActivateCodeDto {
  @IsString({message: 'Должно быть строковым значением'})
  @IsEmail({}, {message: 'Е-майл должен быть валидным'})
  @CheckEmailStatus()
  email: string
}

export class PasswordRecoveryDto {
  email: string
}
