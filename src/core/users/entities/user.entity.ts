import { TokenEntity } from 'src/core/auth/entities/token.entity';
import { RoomEntity } from 'src/core/chat/rooms/entities/room.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  public login: string;

  @Column({
    nullable: false,
  })
  public name: string;

  @Column({
    nullable: false,
  })
  public password: string;

  @Column({
    nullable: false,
  })
  public salt: string;

  @Column({
    nullable: false,
  })
  public age: number;

  @ManyToMany(() => RoomEntity, (room) => room.users)
  public rooms: RoomEntity[];

  @OneToOne(() => TokenEntity, (token) => token.user)
  public token: TokenEntity;
}
