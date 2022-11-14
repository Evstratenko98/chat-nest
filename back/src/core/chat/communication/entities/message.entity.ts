import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomEntity } from '../../rooms/entities/room.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    nullable: false,
  })
  public text: string;

  @CreateDateColumn()
  public createAt: Date;

  @ManyToOne(() => RoomEntity, (room) => room.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public room: RoomEntity;
}
