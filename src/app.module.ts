import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseDelete from 'mongoose-delete';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/response.interceptor';
import { FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';
import { OtpsModule } from './otps/otps.module';
import { ProductsModule } from './products/products.module';
import { RolesModule } from './roles/roles.module';
import { ShopsModule } from './shops/shops.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { TokenVerifyModule } from './token-verify/token-verify.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(MongooseDelete, {
            overrideMethods: true,
            deletedAt: true,
            deletedBy: true,
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    ShopsModule,
    FilesModule,
    RolesModule,
    SubscribersModule,
    MailModule,
    OtpsModule,
    TokenVerifyModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
