import { Injectable, NotFoundException } from '@nestjs/common';
import {CommentsRepository} from "../infrastructure/comments.repository";
import { HydratedDocument, Model } from 'mongoose';
import {InjectModel} from "@nestjs/mongoose";
import {CommentEntity} from "../domain/comments.entity";
import {CommentCreateModel} from "../api/models/input/create-comment.input.model";
import {PostsService} from "../../posts/application/posts.service";
import { User } from '../../users/domain/users.entity';
import { TokensService } from '../../tokens/application/tokens.service';
import { LikeHandler } from '../../likes/domain/like.handler';
import { LikeEntity } from '../../likes/domain/likes.entity';
import { LikeStatus } from '../../posts/api/models/output/post.view.model';
import { CommentViewModel } from '../api/models/output/comment.view.model';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel('CommentEntity') private commentModel: Model<CommentEntity>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('LikeEntity') private readonly likeModel: Model<LikeEntity>,
        private readonly commentsRepository: CommentsRepository,
        private readonly commentsQueryRepository: CommentsQueryRepository,
        private readonly postsService: PostsService,
        private readonly tokensService: TokensService,
        private readonly likeHandler: LikeHandler,
        private readonly usersRepository: UsersRepository,
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

    async generateCommentsData(items: CommentViewModel[], bearerHeader: string) {
        const commentsMap = await Promise.all(items.map(async (item) => {
              return this.generateNewCommentData(item, bearerHeader)
          })
        )
        return commentsMap
    }

    async generateNewCommentData(item: any, bearerHeader: string) {
        const isUserExists = await this.usersRepository.findUserByToken(bearerHeader)
        const likeStatus = await this.likeModel.findOne({commentId: item.id, userId: isUserExists?._id})
        const myStatus = isUserExists && likeStatus ? likeStatus.status : LikeStatus.None
        const newCommentData = this.addStatusPayload(item, myStatus)
        return newCommentData
    }

    addStatusPayload(comment: CommentViewModel, status?: string) {
        const newStatus = status ? status : LikeStatus.None
        return {
            ...comment,
            likesInfo: {
                ...comment.likesInfo,
                myStatus: newStatus
            }
        }
    }

}
