import {Injectable, NotFoundException} from "@nestjs/common";
import {CommentEntity} from "../domain/comments.entity";
import {HydratedDocument, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {CommentViewModel} from "../api/models/output/comment.view.model";


@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectModel(CommentEntity.name) private readonly CommentModel: Model<CommentEntity>
    ) {
    }

    async getAllCommentsByPostId(postId: string): Promise<CommentViewModel[]> {
        const comments = await this.CommentModel.find({postId})
        return comments.map(comment => this.commentOutputMap(comment as unknown as HydratedDocument<CommentViewModel>))
    }



    async commentOutput(id: string): Promise<CommentViewModel> {
        const comment = await this.CommentModel.findById(id)
        if (!comment) {
            throw new NotFoundException("Comment not found")
        }
        return this.commentOutputMap(comment as unknown as HydratedDocument<CommentViewModel>)
    }

    commentOutputMap(comment: HydratedDocument<CommentViewModel>): CommentViewModel {
        const {_id, content, commentatorInfo, likesInfo, createdAt} = comment
        return {
            id: _id.toString(),
            content,
            commentatorInfo,
            likesInfo: {
                likesCount: likesInfo.likesCount,
                dislikesCount: likesInfo.dislikesCount
            },
            createdAt
        }
    }

}
