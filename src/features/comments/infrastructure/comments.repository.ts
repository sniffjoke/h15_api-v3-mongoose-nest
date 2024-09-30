import {Injectable} from "@nestjs/common";
import {HydratedDocument} from "mongoose";
import {CommentEntity} from "../domain/comments.entity";


@Injectable()
export class CommentsRepository {
    constructor(
    ) {
    }

    async saveComment(comment: HydratedDocument<CommentEntity>) {
        const saveComment = await comment.save()
        return saveComment
    }

}
