import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitmqConsumerService } from './rabbitmq-consumer.service';

@Controller()
export class RabbitmqConsumerController {
  constructor(private readonly rmqConsumerService: RabbitmqConsumerService) {}

  @MessagePattern('send_message')
  handleMessage(message: string) {
    console.log('Received message:', message);
  }

  @MessagePattern('assign_salesperson')
  async handleAssignSalesperson(leadData) {
    console.log('Received assign_salesperson message:', leadData);
    await this.rmqConsumerService.assignSalesperson(leadData);
  }

  @MessagePattern('create_client_user')
  async handleCreateClientUser(leadData) {
    console.log('Received create_client_user message:', leadData);
    await this.rmqConsumerService.createClientUser(leadData);
  }
}
