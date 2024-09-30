import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class LikeEntity {

    @Prop({type: mongoose.Types.ObjectId, required: true, default: '2jk32i2ojiso324'})
    userId: string;

    @Prop({type: String})
    postId: string;

    @Prop({type: String})
    commentId: string;

}

export const LikeSchema = SchemaFactory.createForClass(LikeEntity);
