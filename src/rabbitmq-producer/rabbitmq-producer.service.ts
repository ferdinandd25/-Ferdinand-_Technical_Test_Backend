import { Injectable } from '@nestjs/common';
import { Client, ClientRMQ, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class RabbitmqProducerService {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI],
      queue: 'test_queue',
      queueOptions: {
        durable: false,
      },
    },
  })
  client: ClientRMQ;

  // Send message to the RabbitMQ queue
  sendMessage(message: string): Observable<any> {
    return this.client.emit('send_message', message);
  }

  // assign salesperson
  assignSalesperson(leadData): Observable<any> {
    return this.client.emit('assign_salesperson', leadData);
  }

  // create user on leads status DEAL
  createClientUser(leadData): Observable<any> {
    return this.client.emit('create_client_user', leadData);
  }
}
