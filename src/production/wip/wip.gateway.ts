import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface WipTickPayload {
  wipId: string;
  stepSeq: number;
  operation: string;
  machineName: string;
  countPerSecond: number;   // unidades producidas en el último segundo
  totalCount: number;       // acumulado desde que empezó
  targetQty: number;        // cantidad objetivo
  progressPct: number;      // % completado
  efficiency: number;       // % eficiencia (fluctúa levemente)
  elapsedSec: number;       // segundos transcurridos
  rpm?: number;             // RPM de la máquina (opcional)
  temperature?: number;     // temperatura (opcional)
  status: 'RUNNING' | 'PAUSED' | 'ALERT';
}

interface SimSession {
  wipId: string;
  stepSeq: number;
  operation: string;
  machineName: string;
  targetQty: number;
  baseRate: number;         // unidades/seg base
  elapsed: number;          // segundos corridos
  produced: number;         // total producido
  baseEfficiency: number;
  interval: ReturnType<typeof setInterval>;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/wip',
})
export class WipGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  /** Map: socketId → SimSession */
  private sessions = new Map<string, SimSession>();

  handleConnection(client: Socket) {
    console.log(`[WIP WS] client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[WIP WS] client disconnected: ${client.id}`);
    this.stopSession(client.id);
  }

  @SubscribeMessage('wip:subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      wipId: string;
      stepSeq: number;
      operation: string;
      machineName: string;
      targetQty: number;
      baseRate?: number;         // unidades/seg, default 2
      baseEfficiency?: number;   // default 88
    },
  ) {
    // Si ya hay sesión para este cliente la detenemos
    this.stopSession(client.id);

    const baseRate = payload.baseRate ?? 2;
    const baseEfficiency = payload.baseEfficiency ?? 88;

    const session: SimSession = {
      wipId: payload.wipId,
      stepSeq: payload.stepSeq,
      operation: payload.operation,
      machineName: payload.machineName,
      targetQty: payload.targetQty,
      baseRate,
      elapsed: 0,
      produced: 0,
      baseEfficiency,
      interval: setInterval(() => this.tick(client, session), 1000),
    };

    this.sessions.set(client.id, session);
    client.emit('wip:subscribed', { wipId: payload.wipId, stepSeq: payload.stepSeq });
  }

  @SubscribeMessage('wip:unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket) {
    this.stopSession(client.id);
    client.emit('wip:unsubscribed', {});
  }

  private tick(client: Socket, session: SimSession) {
    session.elapsed++;

    // Pequeña variación aleatoria en la tasa y eficiencia para simular realismo
    const jitter = (Math.random() - 0.5) * 0.6;          // ±0.3 u/s
    const rate = Math.max(0.5, session.baseRate + jitter);
    const countThisSec = Math.round(rate * 10) / 10;

    session.produced = Math.min(session.produced + countThisSec, session.targetQty);

    const effJitter = (Math.random() - 0.5) * 6;          // ±3%
    const efficiency = Math.round(
      Math.min(100, Math.max(50, session.baseEfficiency + effJitter)),
    );

    const progressPct = Math.round((session.produced / session.targetQty) * 100);
    const rpm = Math.round(1200 + (Math.random() - 0.5) * 80);
    const temperature = Math.round(65 + Math.random() * 10);

    const status: WipTickPayload['status'] =
      temperature > 73 ? 'ALERT' : efficiency < 60 ? 'ALERT' : 'RUNNING';

    const payload: WipTickPayload = {
      wipId: session.wipId,
      stepSeq: session.stepSeq,
      operation: session.operation,
      machineName: session.machineName,
      countPerSecond: countThisSec,
      totalCount: Math.round(session.produced),
      targetQty: session.targetQty,
      progressPct,
      efficiency,
      elapsedSec: session.elapsed,
      rpm,
      temperature,
      status,
    };

    client.emit('wip:tick', payload);

    // Si llegó al 100%, detener la simulación automáticamente
    if (session.produced >= session.targetQty) {
      this.stopSession(client.id);
      client.emit('wip:completed', { wipId: session.wipId, stepSeq: session.stepSeq });
    }
  }

  private stopSession(socketId: string) {
    const s = this.sessions.get(socketId);
    if (s) {
      clearInterval(s.interval);
      this.sessions.delete(socketId);
    }
  }
}
