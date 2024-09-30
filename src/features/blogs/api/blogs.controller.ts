import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UseFilters
} from "@nestjs/common";
import {BlogsService} from "../application/blogs.service";
import {BlogsQueryRepository} from "../infrastructure/blogs.query-repository";
import {BlogCreateModel} from "./models/input/create-blog.input.model";
import {BlogViewModel} from "./models/output/blog.view.model";
import {UpdateWriteOpResult} from "mongoose";
import {PostCreateModel} from "../../posts/api/models/input/create-post.input.model";
import {PostsService} from "../../posts/application/posts.service";
import {PostsQueryRepository} from "../../posts/infrastructure/posts.query-repository";
import {NotFoundExceptionFilter} from "../../../infrastructure/common/exception-filters/not-found-exception-filter";

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly blogsQueryRepository: BlogsQueryRepository,
        private readonly postsService: PostsService,
        private readonly postsQueryRepository: PostsQueryRepository
    ) {}

    @Get()
    async getAll(@Query() query: any) {
        const blogsWithQuery = await this.blogsQueryRepository.getAllBlogsWithQuery(query)
        return blogsWithQuery
    }

    @Post()
    async createBlog(@Body() dto: BlogCreateModel): Promise<BlogViewModel> {
        const blogId = await this.blogsService.createBlog(dto)
        const newBlog = await this.blogsQueryRepository.blogOutput(blogId)
        return newBlog
    }

    @Get(':id')
    @UseFilters(NotFoundExceptionFilter)
    async getBlogById(@Param('id') id: string): Promise<BlogViewModel> {
        const blog = await this.blogsQueryRepository.blogOutput(id)
        return blog
    }

    @Put(':id')
    @HttpCode(204)
    async updateBlogById(@Param('id') id: string, @Body() dto: BlogCreateModel): Promise<UpdateWriteOpResult> {
        const updateBlog = await this.blogsService.updateBlog(id, dto)
        return updateBlog
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteBlog(@Param('id') id: string) {
        const deleteBlog = await this.blogsService.deleteBlog(id)
        return deleteBlog
    }

    @Post(':id/posts')
    async createPostWithParams(@Body() dto: Omit<PostCreateModel, 'blogId'>, @Param('id') id: string) {
        const createPostId = await this.postsService.createPostWithParams(dto, id)
        const newPost = await this.postsQueryRepository.postOutput(createPostId)
        return newPost
    }

    @Get(':id/posts')
    async getAllPostsByBlogId(@Param('id') id: string, @Query() query: any) {
        const posts = await this.postsQueryRepository.getAllPostsWithQuery(query, id)
        return posts
    }

}
