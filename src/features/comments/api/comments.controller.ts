import { Body, Controller, Get, HttpCode, Param, Put, Req, UseGuards } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { CommentViewModel } from './models/output/comment.view.model';
import { Request } from 'express';
import { CommentsService } from '../application/comments.service';
import { LikeHandler } from '../../likes/domain/like.handler';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { HydratedDocument } from 'mongoose';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likeHandler: LikeHandler
  ) {

  }

  @Get(':id')
  async getCommentById(@Param('id') id: string, @Req() req: Request) {
    const comment = await this.commentsRepository.findCommentById(id);
    const commentViewData = this.commentsQueryRepository.commentOutputMap(comment as unknown as HydratedDocument<CommentViewModel>);
    const commentData = await this.commentsService.generateNewCommentData(commentViewData, req.headers.authorization as string)
    // const commentViewData = await this.commentsQueryRepository.commentOutput(commentData.id)
    return commentData;
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updatePostByIdWithLikeStatus(@Body() like: any, @Param('id') commentId: string, @Req() req: Request) {
    const { findedComment, user } = await this.commentsService.updateCommentByIdWithLikeStatus(req.headers.authorization as string, commentId);
    return await this.likeHandler.commentHandler(req.body.likeStatus, findedComment!, user!);
  }

}
