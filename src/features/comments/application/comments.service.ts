import { Injectable, NotFoundException } from '@nestjs/common';
import {CommentsRepository} from "../infrastructure/comments.repository";
import { HydratedDocument, Model } from 'mongoose';
import {InjectModel} from "@nestjs/mongoose";
import {CommentEntity} from "../domain/comments.entity";
import {CommentCreateModel} from "../api/models/input/create-comment.input.model";
import {PostsService} from "../../posts/application/posts.service";
import { User } from '../../users/domain/users.entity';
import { TokensService } from '../../tokens/application/tokens.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(CommentEntity.name) private commentModel: Model<CommentEntity>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly commentsRepository: CommentsRepository,
        private readonly postsService: PostsService,
        private readonly tokensService: TokensService,
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

    async updateCommentByIdWithLikeStatus(bearerHeader: string, commentId: string) {
        const token = this.tokensService.getToken(bearerHeader);
        const decodedToken: any = this.tokensService.validateAccessToken(token);
        const user: HydratedDocument<User> | null = await this.userModel.findById(decodedToken?._id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const findedComment = await this.commentModel.findById(commentId);
        if (!findedComment) {
            throw new NotFoundException("Post not found")
        }
        return {
            findedComment,
            user
        }
    }

}
