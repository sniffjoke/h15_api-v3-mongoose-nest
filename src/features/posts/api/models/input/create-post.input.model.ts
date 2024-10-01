import { IsString, Length } from 'class-validator';

export class PostCreateModel {
    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 30, {message: 'Количество знаков 1-30'})
    title: string;

    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 100, {message: 'Количество знаков 1-100'})
    shortDescription: string;

    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 1000, {message: 'Количество знаков 1-1000'})
    content: string;

    blogId: string;
}
