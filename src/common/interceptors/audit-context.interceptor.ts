import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { userContextStorage, AuditUser } from '../user-context';

/**
 * AuditContextInterceptor
 * ─────────────────────────────────────────────────────────────────
 * Extrae el usuario del JWT (header Authorization: Bearer <token>)
 * y lo almacena en el AsyncLocalStorage para que el AuditSubscriber
 * pueda leerlo y rellenar usu_creacion / usu_edicion / usu_eliminacion
 * en cada INSERT / UPDATE / SOFT-DELETE.
 * ─────────────────────────────────────────────────────────────────
 */
@Injectable()
export class AuditContextInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest<Request & { headers: Record<string, string> }>();
    const authHeader = request.headers['authorization'] ?? '';
    let user: AuditUser = {};

    if (authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        // verify() lanza si el token es inválido
        const payload = this.jwtService.verify<{
          sub?: string;
          email?: string;
          name?: string;
          firstName?: string;
          lastName?: string;
        }>(token);

        user = {
          id: payload.sub,
          email: payload.email,
          name: payload.name ?? ([payload.firstName, payload.lastName].filter(Boolean).join(' ') || payload.email),
        };
      } catch {
        // Token inválido → auditoría sin usuario identificado
      }
    }

    return new Observable((subscriber) => {
      userContextStorage.run(user, () => {
        next.handle().subscribe({
          next: (v) => subscriber.next(v),
          error: (e) => subscriber.error(e),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
