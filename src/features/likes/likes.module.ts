import { Module } from "@nestjs/common";
import { LikesService } from "./application/likes.service";
import { MongooseModule } from "@nestjs/mongoose";
import { LikeEntity, LikeSchema } from './domain/likes.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{
        name: LikeEntity.name,
        schema: LikeSchema,
    }]),
  ],
  controllers: [],
  providers: [
    LikesService
  ],
  exports: [
    LikesService
  ]
})
export class LikesModule {}
