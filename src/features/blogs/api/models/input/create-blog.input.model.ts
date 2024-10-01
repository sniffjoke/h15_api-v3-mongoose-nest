import { IsString, IsUrl, Length } from 'class-validator';

export class BlogCreateModel {
    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 15, {message: 'Количество знаков 1-15'})
    name: string;

    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 500, {message: 'Количество знаков 1-500'})
    description: string;

    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 100, {message: 'Количество знаков 1-100'})
    @IsUrl({}, {message: 'Введите валидный URL'})
    websiteUrl: string;
}
