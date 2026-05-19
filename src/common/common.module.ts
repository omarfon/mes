import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditContextInterceptor } from './interceptors/audit-context.interceptor';
import { AuditSubscriber } from './subscribers/audit.subscriber';

/**
 * CommonModule
 * ─────────────────────────────────────────────────────────────────
 * Módulo global que registra:
 *  • AuditContextInterceptor  — extrae usuario del JWT por request
 *  • AuditSubscriber          — rellena usu_* en cada INSERT/UPDATE/DELETE
 * ─────────────────────────────────────────────────────────────────
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_EXPIRES_IN') || '365d' },
      }),
    }),
  ],
  providers: [
    AuditSubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditContextInterceptor,
    },
  ],
  exports: [JwtModule],
})
export class CommonModule {}
