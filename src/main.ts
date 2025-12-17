import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('API MES')
    .setDescription('Documentación de la API del Sistema MES')
    .setVersion('1.0')
    .addBearerAuth() // Si usas JWT
    .build();

    app.enableCors({
    origin: 'http://localhost:4200', // front Angular
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`Swagger levantado en: http://localhost:3000/api/docs`);
}
bootstrap();