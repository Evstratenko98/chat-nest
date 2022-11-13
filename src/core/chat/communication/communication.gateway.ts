import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { CommunicationService } from './communication.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { UpdateCommunicationDto } from './dto/update-communication.dto';

@WebSocketGateway(80, { namespace: 'communication' })
export class CommunicationGateway {
  constructor(private readonly communicationService: CommunicationService) {}

  @SubscribeMessage('createCommunication')
  create(@MessageBody() createCommunicationDto: CreateCommunicationDto) {
    return this.communicationService.create(createCommunicationDto);
  }

  @SubscribeMessage('findAllCommunication')
  findAll() {
    return this.communicationService.findAll();
  }

  @SubscribeMessage('findOneCommunication')
  findOne(@MessageBody() id: number) {
    return this.communicationService.findOne(id);
  }

  @SubscribeMessage('updateCommunication')
  update(@MessageBody() updateCommunicationDto: UpdateCommunicationDto) {
    return this.communicationService.update(
      updateCommunicationDto.id,
      updateCommunicationDto,
    );
  }

  @SubscribeMessage('removeCommunication')
  remove(@MessageBody() id: number) {
    return this.communicationService.remove(id);
  }
}
