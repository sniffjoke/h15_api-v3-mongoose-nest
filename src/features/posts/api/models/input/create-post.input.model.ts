import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim';
import { BlogExists } from '../../../../../core/decorators/async-validate/blog-is-exist.decorator';

export class PostCreateModel {
    @Trim()
    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 30, {message: 'Количество знаков 1-30'})
    title: string;

    @Trim()
    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 100, {message: 'Количество знаков 1-100'})
    shortDescription: string;

    @Trim()
    @IsString({message: 'Должно быть строковым значением'})
    @Length(1, 1000, {message: 'Количество знаков 1-1000'})
    content: string;

    @BlogExists()
    blogId: string;
}
