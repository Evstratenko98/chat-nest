import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/error';
import { checkEntity } from 'src/common/functions/checkEntity';
import { transformUserEntity } from 'src/core/users/dto/transformer';
import { UserEntity } from 'src/core/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthorizationDto } from '../dto/authorization.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { TokenEntity } from '../entities/token.entity';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  public async me(jwtToken) {
    const userInfo: any = await this.tokenService.validateAccessToken(jwtToken);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = userInfo;
    const user = await checkEntity(this.userEntityRepository, { id });
    if (!user) createError(HttpStatus.NOT_FOUND, 'User not found');
    return transformUserEntity(user);
  }

  public async registration(registrationDto: RegistrationDto) {
    const { login, password, ...other } = registrationDto;
    const checkUser = await checkEntity(this.userEntityRepository, { login });
    if (checkUser) createError(HttpStatus.CONFLICT, 'The user already exists.');

    const hashPassword = this.passwordService.hashPassword(password);
    const user = await this.userEntityRepository.save(
      this.userEntityRepository.create({
        login,
        ...hashPassword,
        ...other,
      }),
    );

    const tokens = await this.getTokensByUser(user);
    return {
      user: transformUserEntity(user),
      tokens,
    };
  }

  public async authorization(authorizationDto: AuthorizationDto) {
    const { login, password } = authorizationDto;
    const user = await checkEntity(this.userEntityRepository, { login });
    if (!user) createError(HttpStatus.NOT_FOUND, 'User not found');

    const isPasswordEquals = this.passwordService.comparePassword(
      password,
      user.password,
      user.salt,
    );
    if (!isPasswordEquals)
      createError(HttpStatus.BAD_REQUEST, 'Incorrect password');

    const tokens = await this.getTokensByUser(user);
    return {
      user: transformUserEntity(user),
      tokens,
    };
  }

  public async logout(refreshToken: string): Promise<{ message: string }> {
    const client = await this.tokenService.validateRefreshToken(refreshToken);
    if (!client) createError(HttpStatus.UNAUTHORIZED, 'User is not authorized');
    await this.tokenService.removeToken(refreshToken);
    return { message: 'Success' };
  }

  public async refresh(refreshToken: string) {
    if (!refreshToken)
      createError(HttpStatus.UNAUTHORIZED, 'User is not authorized');
    const user: any = await this.tokenService.validateRefreshToken(
      refreshToken,
    );
    const tokenFromDB = await this.tokenService.findToken(refreshToken);

    if (!user || tokenFromDB)
      createError(HttpStatus.UNAUTHORIZED, 'User is not authorized');

    const refreshInfoByUser = await checkEntity(this.userEntityRepository, {
      id: user.id,
    });
    const updatedUser = await this.userEntityRepository.save(refreshInfoByUser);
    const tokens = await this.getTokensByUser(refreshInfoByUser);
    return { user: transformUserEntity(updatedUser), tokens };
  }

  private async getTokensByUser(user: UserEntity) {
    const tokens = this.tokenService.createToken({
      ...transformUserEntity(user),
      tokenCreationTime: new Date(),
    });

    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
