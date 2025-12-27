import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS - Permitir conexiones desde el frontend
  const allowedOrigins = [
    'http://localhost:4200',  // Frontend Angular en desarrollo
    'http://localhost:4201',  // Puerto alternativo
    'http://127.0.0.1:4200',  // Localhost alternativo
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como Postman, Thunder Client, etc)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`⚠️  Origen bloqueado por CORS: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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
      forbidNonWhitelisted: true
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