import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";

class BaseEntity {
    createdAt: Date
}

@Schema({timestamps: false, _id: false})
export class NewestLikes {
    @Prop({type: String, required: true, default: new Date(Date.now()).toISOString()})
    addedAt: string

    @Prop({type: String, required: true, default: '28jd918u12jdj8291j31'})
    userId: string

    @Prop({type: String, required: true, default: 'User-login'})
    login: string
}

@Schema({timestamps: false, _id: false})
export class ExtendedLikesInfo {
    @Prop({type: Number, default: 0})
    likesCount: number;

    @Prop({type: Number, default: 0})
    dislikesCount: number;

    @Prop({type: [NewestLikes], required: true, default: new NewestLikes})
    newestLikes: NewestLikes[]
}


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class Post {
    @Prop({type: String, required: true})
    title: string;

    @Prop({type: String, required: true})
    shortDescription: string;

    @Prop({type: String, required: true})
    content: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Blog'})
    blogId: string

    @Prop({type: String, required: true})
    blogName: string;

    @Prop({type: ExtendedLikesInfo, default: new ExtendedLikesInfo})
    extendedLikesInfo: ExtendedLikesInfo;

}

export const PostSchema = SchemaFactory.createForClass(Post);
