import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Post} from "../domain/posts.entity";
import { HydratedDocument, Model, UpdateWriteOpResult } from 'mongoose';
import {PostsRepository} from "../infrastructure/posts.repository";
import {PostCreateModel} from "../api/models/input/create-post.input.model";
import {BlogsService} from "../../blogs/application/blogs.service";
import { User } from '../../users/domain/users.entity';
import { TokensService } from '../../tokens/application/tokens.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<Post>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly postsRepository: PostsRepository,
        private readonly blogsService: BlogsService,
        private readonly tokensService: TokensService,
    ) {
    }

    async createPost(post: PostCreateModel): Promise<string> {
        const findedBlog = await this.blogsService.findBlogById(post.blogId)
        const newPost = new this.postModel({...post, blogName: findedBlog?.name})
        const saveData = await this.postsRepository.savePost(newPost)
        return saveData._id.toString()
    }

    async createPostWithParams(post: Omit<PostCreateModel, 'blogId'>, blogId: string): Promise<string> {
        const findedBlog = await this.blogsService.findBlogById(blogId)
        if (!findedBlog) {
            throw new NotFoundException("Post not found")
        }
        const newPost = new this.postModel({...post, blogName: findedBlog?.name, blogId: findedBlog?.id})
        const saveData = await this.postsRepository.savePost(newPost)
        return saveData._id.toString()
    }

    async updatePost(id: string, dto: PostCreateModel): Promise<UpdateWriteOpResult> {
        const post = await this.postModel.findById(id)
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`)
        }
        const updatePost = await this.postModel.updateOne({_id: post._id}, {$set: {...dto}})
        return updatePost
    }

    async deletePost(id: string) {
        const findedPost = await this.postModel.findById(id)
        if (!findedPost) {
            throw new NotFoundException(`Post with id ${id} not found`)
        }
        const deletePost = await this.postModel.deleteOne({_id: id})
        return deletePost
    }

    async findPostById(id: string) {
        const findedPost = await this.postModel.findById(id)
        if (!findedPost) {
            throw new NotFoundException(`Post with id ${id} not found`)
        }
        return findedPost
    }

    async updatePostByIdWithLikeStatus(bearerHeader: string, postId: string) {
        const token = this.tokensService.getToken(bearerHeader);
        const decodedToken: any = this.tokensService.validateAccessToken(token);
        const user: HydratedDocument<User> | null = await this.userModel.findById(decodedToken?._id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const findedPost = await this.postModel.findById(postId);
        if (!findedPost) {
            throw new NotFoundException(`Post with id ${postId} not found`)
        }
        return {
            findedPost,
            user
        }
    }

}
