import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./api/posts.controller";
import { PostsService } from "./application/posts.service";
import { PostsRepository } from "./infrastructure/posts.repository";
import { PostsQueryRepository } from "./infrastructure/posts.query-repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./domain/posts.entity";
import { Blog, BlogSchema } from "../blogs/domain/blogs.entity";
import { CommentEntity, CommentSchema } from "../comments/domain/comments.entity";
import { BlogsModule } from "../blogs/blogs.module";
import { CommentsModule } from "../comments/comments.module";

@Module({
  imports: [
    forwardRef(() => BlogsModule),
    CommentsModule,
    MongooseModule.forFeature([{
      name: Post.name,
      schema: PostSchema
    }]),
    MongooseModule.forFeature([{
      name: Blog.name,
      schema: BlogSchema
    }]),
    MongooseModule.forFeature([{
      name: CommentEntity.name,
      schema: CommentSchema
    }])
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
  ],
  exports: [
    forwardRef(() => BlogsModule),
    PostsService,
    PostsRepository,
    PostsQueryRepository
  ],
})
export class PostsModule {
}
