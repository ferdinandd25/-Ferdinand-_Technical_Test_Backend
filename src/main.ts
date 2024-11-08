import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const RABBITMQ_URI = configService.get('RABBITMQ_URI')
  
  // Microservice setup for RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URI], // RabbitMQ connection URL
      queue: 'test_queue',  // The name of the queue to listen to
      queueOptions: {
        durable: false, // Queue durability setting (optional)
      },
    },
  });

  await app.startAllMicroservices();
  await app.enableCors();
  await app.listen(configService.get('PORT', 3000));
}
bootstrap();
