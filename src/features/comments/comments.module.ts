import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsController } from "./api/comments.controller";
import { CommentsService } from "./application/comments.service";
import { CommentsRepository } from "./infrastructure/comments.repository";
import { CommentsQueryRepository } from "./infrastructure/comments.query-repository";
import { Post, PostSchema } from "../posts/domain/posts.entity";
import { CommentSchema, CommentEntity } from "./domain/comments.entity";
import { Blog, BlogSchema } from "../blogs/domain/blogs.entity";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [
    forwardRef(() => PostsModule),
    MongooseModule.forFeature([{
      name: Blog.name,
      schema: BlogSchema
    }]),
    MongooseModule.forFeature([{
      name: Post.name,
      schema: PostSchema
    }]),
    MongooseModule.forFeature([{
      name: CommentEntity.name,
      schema: CommentSchema
    }])
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
  ],
  exports: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository
  ]
})
export class CommentsModule {
}
