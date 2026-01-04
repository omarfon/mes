import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

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

  // Señal para PM2 de que la app está lista
  if (process.send) {
    process.send('ready');
  }

  logger.log('🚀 Servidor MES Backend iniciado');
  logger.log('📍 API: http://localhost:3000');
  logger.log('📚 Swagger: http://localhost:3000/api/docs');
  logger.log('🔗 Frontend permitido: http://localhost:4200');

  // Manejo de señales de cierre graceful
  const gracefulShutdown = async (signal: string) => {
    logger.warn(`${signal} recibido, cerrando servidor...`);
    try {
      await app.close();
      logger.log('Servidor cerrado correctamente');
      process.exit(0);
    } catch (error) {
      logger.error('Error al cerrar servidor:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Manejo de errores no capturados
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  logger.error('Error fatal en bootstrap:', error);
  process.exit(1);
});