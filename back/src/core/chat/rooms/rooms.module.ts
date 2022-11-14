import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from '../communication/entities/message.entity';
import { RoomEntity } from './entities/room.entity';
import { UserEntity } from 'src/core/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, RoomEntity, UserEntity])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
