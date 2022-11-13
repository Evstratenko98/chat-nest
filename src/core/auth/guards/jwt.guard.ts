import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { createError } from 'src/common/error';
import { TokenService } from '../services/token.service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const {
      headers: { cookie },
    } = request;
    if (!cookie) createError(HttpStatus.UNAUTHORIZED, 'Authorization error.');
    const cookies = cookie.split(';').reduce((res, item) => {
      const data = item.trim().split('=');
      return { ...res, [data[0]]: data[1] };
    }, {});

    const token = cookies['refreshToken'];
    if (!token) createError(HttpStatus.UNAUTHORIZED, 'Authorization error.');

    const userFromAccessToken = await this.tokenService.validateAccessToken(
      token,
    );

    if (!userFromAccessToken) {
      const { refreshToken } = await this.tokenService.refreshToken(token);
      response.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return true;
    }

    response.cookie('refreshToken', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return true;
  }
}
