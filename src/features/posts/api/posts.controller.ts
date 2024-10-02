import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PostCreateModel } from './models/input/create-post.input.model';
import { PostsService } from '../application/posts.service';
import { PostViewModel } from './models/output/post.view.model';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { CommentCreateModel } from '../../comments/api/models/input/create-comment.input.model';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query-repository';
import { PaginationBaseModel } from '../../../core/base/pagination.base.model';
import { BasicAuthGuard } from '../../../core/guards/basic-auth.guard';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/domain/users.entity';
import { LikeHandler } from '../../likes/domain/like.handler';

@Controller('posts')
export class PostsController {

  constructor(
    @InjectModel('Post') private readonly postModel: Model<typeof Post>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likeHandler: LikeHandler,
  ) {

  }

  @Get()
  async getAllPosts(@Query() query: any): Promise<PaginationBaseModel<PostViewModel>> {
    const posts = await this.postsQueryRepository.getAllPostsWithQuery(query);
    return posts;
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() dto: PostCreateModel) {
    const postId = await this.postsService.createPost(dto);
    const newPost = this.postsQueryRepository.postOutput(postId);
    return newPost;
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostViewModel> {
    const post = await this.postsQueryRepository.postOutput(id);
    return post;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updatePostById(@Param('id') id: string, @Body() dto: PostCreateModel): Promise<UpdateWriteOpResult> {
    const updatePost = await this.postsService.updatePost(id, dto);
    return updatePost;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deletePost(@Param('id') id: string) {
    const deletePost = await this.postsService.deletePost(id);
    return deletePost;
  }

  @Post(':id/comments')
  // @UseGuards(JwtAuthGuard)
  async createComment(@Body() dto: CommentCreateModel, @Param('id') id: string) {
    const commentId = await this.commentsService.createComment(dto, id);
    const newComment = await this.commentsQueryRepository.commentOutput(commentId);
    return newComment;
  }

  @Get(':id/comments')
  async getAllCommentsByBlogId(@Param('id') id: string) {
    const comments = await this.commentsQueryRepository.getAllCommentsByPostId(id);
    return comments;
  }

  @Put(':id/like-status')
  @HttpCode(204)
  async updatePostByIdWithLikeStatus(@Body() like: any, @Param('id') postId: string, @Req() req: Request) {
    const { findedPost, user} = await this.postsService.updatePostByIdWithLikeStatus(req.headers.authorization as string, postId);
    return await this.likeHandler.postHandler(req.body.likeStatus, findedPost!, user!);
  }

}
