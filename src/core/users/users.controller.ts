import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:login')
  public getUser(@Param('login') login: string) {
    return this.usersService.getUser(login);
  }

  @Put('/:userId')
  public updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete('/:userId')
  public deleteUser(@Param('userId') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
