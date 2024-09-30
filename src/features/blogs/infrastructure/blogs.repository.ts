import {Injectable} from "@nestjs/common";
import {Blog} from "../domain/blogs.entity";
import {HydratedDocument} from "mongoose";


@Injectable()
export class BlogsRepository {
    constructor(
    ) {
    }

    async saveBlog(blog: HydratedDocument<Blog>) {
        const saveBlog = await blog.save()
        return saveBlog
    }

}
