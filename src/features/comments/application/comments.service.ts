import {Injectable, NotFoundException} from '@nestjs/common';
import {CommentsRepository} from "../infrastructure/comments.repository";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {CommentEntity} from "../domain/comments.entity";
import {CommentCreateModel} from "../api/models/input/create-comment.input.model";
import {PostsService} from "../../posts/application/posts.service";

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(CommentEntity.name) private commentModel: Model<CommentEntity>,
        private readonly commentsRepository: CommentsRepository,
        private readonly postsService: PostsService
    ) {
    }

    async createComment(comment: CommentCreateModel, postId: string): Promise<string> {
        const findedPost = await this.postsService.findPostById(postId)
        if (!findedPost) {
            throw new NotFoundException("Post not found")
        }
        const newComment = new this.commentModel({...comment, postId})
        const saveData = await this.commentsRepository.saveComment(newComment)
        return saveData._id.toString()
    }

}
