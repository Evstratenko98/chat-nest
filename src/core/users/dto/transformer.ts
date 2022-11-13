import { UserInfoInToken } from 'src/core/auth/auth.types';
import { UserEntity } from '../entities/user.entity';
import { GetUserDto } from './get-user.dto';

export const transformUserEntity = (user: UserEntity): GetUserDto => ({
  login: user.login,
  name: user.name,
  age: user.age,
});

export const transformUserEntityWithToken = (
  user: UserEntity,
): UserInfoInToken => ({
  ...transformUserEntity(user),
  tokenCreationTime: new Date(),
});
