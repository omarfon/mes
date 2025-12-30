import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Configuración de CORS - Permitir conexiones desde el frontend
  app.enableCors({
    origin: true, // Permitir todos los orígenes en desarrollo
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600,
  });

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('API MES')
    .setDescription('Documentación de la API del Sistema MES')
    .setVersion('1.0')
    .addBearerAuth() // Si usas JWT
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422,
      stopAtFirstError: false,
    })
  )

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 Servidor MES Backend iniciado');
  console.log('📍 API: http://localhost:3000');
  console.log('📚 Swagger: http://localhost:3000/api/docs');
  console.log('🔗 Frontend permitido: http://localhost:4200');
}
bootstrap();