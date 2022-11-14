import { Injectable } from '@nestjs/common';

@Injectable()
export class CommunicationService {
  create() {
    return 'This action adds a new communication';
  }

  findAll() {
    return `This action returns all communication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} communication`;
  }

  update(id: number) {
    return `This action updates a #${id} communication`;
  }

  remove(id: number) {
    return `This action removes a #${id} communication`;
  }
}
