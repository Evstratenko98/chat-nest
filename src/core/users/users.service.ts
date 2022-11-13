import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/error';
import { checkEntity } from 'src/common/functions/checkEntity';
import { Repository } from 'typeorm';
import { RoomEntity } from '../chat/rooms/entities/room.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { transformUserEntity } from './dto/transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  passwordService: any;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomEntityRepository: Repository<RoomEntity>,
  ) {}

  public async getUser(login: string): Promise<GetUserDto> {
    const user = await checkEntity(this.userEntityRepository, { login });
    if (!user) createError(HttpStatus.NOT_FOUND, 'User not found');

    return transformUserEntity(user);
  }

  public async createUser(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const { login, password, ...other } = createUserDto;
    const checkUser = await checkEntity(this.userEntityRepository, { login });
    if (checkUser) createError(HttpStatus.CONFLICT, 'The user already exists.');

    const hashPassword = this.passwordService.hashPassword(password);
    const user = await this.userEntityRepository.save(
      this.userEntityRepository.create({
        login,
        password: hashPassword,
        ...other,
      }),
    );

    return transformUserEntity(user);
  }

  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    const user = await checkEntity(this.userEntityRepository, { id });
    if (!user) createError(HttpStatus.NOT_FOUND, 'User not found');
    const updatedUser = await this.userEntityRepository.save(
      this.userEntityRepository.merge(user, { ...updateUserDto }),
    );

    return transformUserEntity(updatedUser);
  }

  public async deleteUser(id: string): Promise<{ message: string }> {
    const user = await checkEntity(this.userEntityRepository, { id });
    if (!user) createError(HttpStatus.NOT_FOUND, 'User not found');
    await this.userEntityRepository.delete(user);

    return { message: 'User was deleted' };
  }
}
