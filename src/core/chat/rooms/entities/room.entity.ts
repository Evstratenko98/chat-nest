import { UserEntity } from 'src/core/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from '../../communication/entities/message.entity';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    nullable: false,
  })
  public title: string;

  @OneToMany(() => MessageEntity, (message) => message.room)
  public messages: MessageEntity[];

  @ManyToMany(() => UserEntity, (user) => user.rooms)
  @JoinTable()
  public users: UserEntity[];
}
