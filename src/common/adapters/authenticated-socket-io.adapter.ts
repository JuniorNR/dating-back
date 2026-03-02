import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { ServerOptions, Server, Socket } from 'socket.io';
import { AppSocket } from '../types/ws.types';
import { JwtPayload } from '../types/jwt.types';

export class AuthenticatedSocketIoAdapter extends IoAdapter {
  private readonly jwtService: JwtService;
  private readonly i18n: I18nService;

  constructor(app: INestApplicationContext) {
    super(app);
    this.jwtService = app.get(JwtService);
    this.i18n = app.get(I18nService);
  }

  createIOServer(port: number, options?: Partial<ServerOptions>): Server {
    const server: Server = super.createIOServer(port, options) as Server;

    const authMiddleware = (
      socket: Socket,
      next: (err?: Error) => void,
    ): void => {
      try {
        const token =
          (socket.handshake.auth as Record<string, string>)?.token ||
          socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) {
          return next(new Error(this.i18n.t('error.authenticationTokenMissing')));
        }

        (socket as AppSocket).data.user =
          this.jwtService.verify<JwtPayload>(token);
        next();
      } catch {
        next(new Error(this.i18n.t('error.invalidOrExpiredToken')));
      }
    };

    server.use(authMiddleware);
    server.on('new_namespace', (namespace) => {
      namespace.use(authMiddleware);
    });

    return server;
  }
}
