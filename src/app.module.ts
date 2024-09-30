import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsModule } from "./features/blogs/blogs.module";
import { PostsModule } from "./features/posts/posts.module";
import { UsersModule } from "./features/users/users.module";
import { CommentsModule } from "./features/comments/comments.module";
import { TestingModule } from "./features/testing/testing.module";
import { AuthModule } from "./features/auth/auth.module";
import { TokensModule } from "./features/tokens/tokens.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { SETTINGS } from "./infrastructure/settings/settings";
import { LoginIsExistConstraint } from "./infrastructure/decorators/login-is-exist.decorator";
import { EmailIsExistConstraint } from "./infrastructure/decorators/email-is-exist.decorator";
import { CheckEmailStatusConstraint } from "./infrastructure/decorators/check-email-status.decorator";
import { CheckCodeStatusConstraint } from "./infrastructure/decorators/check-code-status.decorator";
import { CodeIsExistConstraint } from "./infrastructure/decorators/code-is-exist.decorator";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".development.env",
      isGlobal: true,
    }),
    MongooseModule.forRoot(SETTINGS.PATH.MONGODB),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      }
    }),
    BlogsModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    TestingModule,
    AuthModule,
    TokensModule
  ],
  controllers: [],
  providers: [
    // {
    //     provide: APP_FILTER,
    //     useClass: NotFoundExceptionFilter
    // }
    LoginIsExistConstraint,
    EmailIsExistConstraint,
    CheckEmailStatusConstraint,
    CodeIsExistConstraint,
    CheckCodeStatusConstraint
  ]
})
export class AppModule {}
