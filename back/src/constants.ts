import { TokenEntity } from './core/auth/entities/token.entity';
import { MessageEntity } from './core/chat/communication/entities/message.entity';
import { RoomEntity } from './core/chat/rooms/entities/room.entity';
import { UserEntity } from './core/users/entities/user.entity';

export const dbEntities = [UserEntity, RoomEntity, MessageEntity, TokenEntity];
