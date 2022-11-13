import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { CommunicationGateway } from './communication.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [CommunicationGateway, CommunicationService],
})
export class CommunicationModule {}
