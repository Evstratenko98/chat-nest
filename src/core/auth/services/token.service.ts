import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, sign, SignOptions, verify } from 'jsonwebtoken';
import { createError } from 'src/common/error';
import { checkEntity } from 'src/common/functions/checkEntity';
import { transformUserEntityWithToken } from 'src/core/users/dto/transformer';
import { UserEntity } from 'src/core/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Tokens, UserInfoInToken } from '../auth.types';
import { TokenEntity } from '../entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  public createToken(meta: UserInfoInToken): Tokens {
    const accessOptions: SignOptions = {
      algorithm: 'HS256',
      expiresIn: '15m',
    };
    const accessToken: string = sign(
      meta,
      this.configService.get('JWT_ACCESS_SECRET'),
      accessOptions,
    );

    const refreshOptions: SignOptions = {
      algorithm: 'HS256',
      expiresIn: '30d',
    };
    const refreshToken: string = sign(
      meta,
      this.configService.get('JWT_REFRESH_SECRET'),
      refreshOptions,
    );

    return { accessToken, refreshToken };
  }

  public async saveToken(id, refreshToken) {
    const client = await checkEntity(this.userEntityRepository, { id });
    const tokenEntity = await checkEntity(this.tokenEntityRepository, {
      client,
    });

    if (tokenEntity) {
      const updateTokenEntity = await this.tokenEntityRepository.merge(
        tokenEntity,
        { refreshToken },
      );
      return await this.tokenEntityRepository.update(
        tokenEntity,
        updateTokenEntity,
      );
    }

    const createdTokenEnity = await this.tokenEntityRepository.create({
      id,
      refreshToken,
    });

    return await this.tokenEntityRepository.save(createdTokenEnity);
  }

  public async removeToken(refreshToken: string) {
    const token = await this.tokenEntityRepository.delete({ refreshToken });

    return token;
  }

  public async validateAccessToken(
    token: string,
  ): Promise<string | JwtPayload> {
    try {
      const { payload } = verify(
        token,
        this.configService.get('JWT_ACCESS_SECRET'),
        {
          complete: true,
        },
      );
      return payload;
    } catch (error) {
      return null;
    }
  }

  public async validateRefreshToken(
    token: string,
  ): Promise<string | JwtPayload> {
    try {
      const { payload } = verify(
        token,
        this.configService.get('JWT_REFRESH_SECRET'),
        {
          complete: true,
        },
      );
      return payload;
    } catch (error) {
      return null;
    }
  }

  public async findToken(refreshToken): Promise<TokenEntity> {
    const token = await this.tokenEntityRepository.findOne({
      where: {
        refreshToken,
      },
    });

    return token;
  }

  public async refreshToken(refreshToken: string) {
    const userInfoInToken = await this.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.findToken(refreshToken);

    if (!userInfoInToken || tokenFromDB)
      createError(HttpStatus.UNAUTHORIZED, 'User is not authorized');

    const { id } = userInfoInToken as JwtPayload;
    const refreshInfoByUserEntity = await this.userEntityRepository.findOne({
      where: {
        id,
      },
    });

    const tokens = await this.getTokensByUser(refreshInfoByUserEntity);
    return tokens;
  }

  public async getTokensByUser(user: UserEntity) {
    const tokens: Tokens = this.createToken(transformUserEntityWithToken(user));
    await this.saveToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
