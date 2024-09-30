import { Module } from "@nestjs/common";
import { LikesService } from "./application/likes.service";
import { JwtModule} from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { TokenEntity, TokenSchema } from "./domain/likes.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{
        name: TokenEntity.name,
        schema: TokenSchema,
    }]),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secretOrPrivateKey: configService.get(SETTINGS.VARIABLES.JWT_SECRET_ACCESS_TOKEN as string),
        // secretOrPrivateKey: configService.get('fjsklajekwljrlk2jkfdsjklf'),
        // secretOrPrivateKey: configService.get(process.env.JWT_SECRET_ACCESS),
        // signOptions: {
        //   expiresIn: '3600'
        // }
      // }),
      // inject: [ConfigService],
    // })
    JwtModule.register({global: true})
  ],
  controllers: [],
  providers: [
    LikesService
  ],
  exports: [
    LikesService,
    JwtModule
  ]
})
export class LikesModule {}
