import { GetUserDto } from '../users/dto/get-user.dto';

export interface UserInfoInToken extends GetUserDto {
  tokenCreationTime: Date;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
