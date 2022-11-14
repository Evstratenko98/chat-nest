import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { CommunicationService } from './communication.service';

@WebSocketGateway(80, { namespace: 'communication' })
export class CommunicationGateway {
  constructor(private readonly communicationService: CommunicationService) {}

  @SubscribeMessage('findAllCommunication')
  findAll() {
    return this.communicationService.findAll();
  }
}
