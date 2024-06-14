import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import MongooseDelete from 'mongoose-delete';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/response.interceptor';
import { ProductsModule } from './products/products.module';
import { ShopsModule } from './shops/shops.module';
import { FilesModule } from './files/files.module';
import { RolesModule } from './roles/roles.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SubscribersModule } from './subscribers/subscribers.module';
import { MailModule } from './mail/mail.module';
import { RolesGuard } from './guards/roles.guard';
import { OtpsModule } from './otps/otps.module';
import { TokenVerifyModule } from './token-verify/token-verify.module';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
