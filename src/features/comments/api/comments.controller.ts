import {Controller, Get, Param} from '@nestjs/common';
import {CommentsQueryRepository} from "../infrastructure/comments.query-repository";
import {CommentViewModel} from "./models/output/comment.view.model";

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentsQueryRepository: CommentsQueryRepository
    ) {

    }

    @Get(':id')
    async getCommentById(@Param('id') id: string): Promise<CommentViewModel> {
        const comment = await this.commentsQueryRepository.commentOutput(id)
        return comment
    }

}
