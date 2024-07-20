import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('DTL-Shop API Document')
    .setDescription('All module API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Enter JWT token`,
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'accessToken',
    )
    .addSecurityRequirements('accessToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  await app.listen(port);
}
bootstrap();
