import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Post} from "../domain/posts.entity";
import {Model, UpdateWriteOpResult} from "mongoose";
import {PostsRepository} from "../infrastructure/posts.repository";
import {PostCreateModel} from "../api/models/input/create-post.input.model";
import {BlogsService} from "../../blogs/application/blogs.service";

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<Post>,
        private readonly postsRepository: PostsRepository,
        private readonly blogsService: BlogsService
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

}
