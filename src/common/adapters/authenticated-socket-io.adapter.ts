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

    const parseCookieHeader = (
      cookieHeader?: string,
    ): Record<string, string> => {
      if (!cookieHeader) return {};

      return cookieHeader
        .split(';')
        .map((part) => part.trim())
        .reduce<Record<string, string>>((acc, part) => {
          const separatorIndex = part.indexOf('=');
          if (separatorIndex < 0) return acc;

          const key = decodeURIComponent(part.slice(0, separatorIndex).trim());
          const value = decodeURIComponent(
            part.slice(separatorIndex + 1).trim(),
          );
          acc[key] = value;
          return acc;
        }, {});
    };

    const authMiddleware = (
      socket: Socket,
      next: (err?: Error) => void,
    ): void => {
      try {
        const cookieName = String(process.env['JWT_ACCESS_COOKIE_NAME'] || '');
        const cookies = parseCookieHeader(socket.handshake.headers?.cookie);
        const tokenFromCookie =
          cookieName && typeof cookies[cookieName] === 'string'
            ? cookies[cookieName]
            : undefined;

        const token =
          tokenFromCookie ||
          (socket.handshake.auth as Record<string, string>)?.token ||
          socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) {
          return next(
            new Error(this.i18n.t('error.authenticationTokenMissing')),
          );
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
