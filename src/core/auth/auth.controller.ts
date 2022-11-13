import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthorizationDto } from './dto/authorization.dto';
import { RegistrationDto } from './dto/registration.dto';
import { JWTGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JWTGuard)
  public async me(@Res({ passthrough: true }) response: Response) {
    const cookies = response.getHeader('set-cookie');
    if (typeof cookies === 'string') {
      const refreshToken = cookies.substring(
        cookies.indexOf('=') + 1,
        cookies.indexOf(';'),
      );
      return this.authService.me(refreshToken);
    }
  }

  @Post('registration')
  public async registration(
    @Body() registrationDto: RegistrationDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.registration(
      registrationDto,
    );
    response.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return user;
  }

  @Post('authorization')
  public async authorization(
    @Body() authorizationDto: AuthorizationDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.authorization(
      authorizationDto,
    );
    response.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return user;
  }

  @Get('logout')
  public async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const message = await this.authService.logout(refreshToken);
    response.clearCookie('refreshToken');

    return message;
  }
}
