import { CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoomEntity } from '../../rooms/entities/room.entity';

export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public createAt: Date;

  @ManyToOne(() => RoomEntity, (room) => room.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public room: RoomEntity;
}
