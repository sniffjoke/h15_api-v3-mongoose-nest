import { IsString, Length } from 'class-validator';

export class CommentCreateModel {
    @IsString({message: 'Должно быть строковым значением'})
    @Length(20, 300, {message: 'Количество знаков 20-300'})
    content: string
}
