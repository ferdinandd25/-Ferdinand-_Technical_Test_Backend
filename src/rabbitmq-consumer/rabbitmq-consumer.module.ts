import { Module } from '@nestjs/common';
import { RabbitmqConsumerController } from './rabbitmq-consumer.controller';
import { RabbitmqConsumerService } from './rabbitmq-consumer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead, LeadSchema } from 'src/schemas/lead.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Config, ConfigSchema } from 'src/schemas/config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: User.name, schema: UserSchema },
      { name: Config.name, schema: ConfigSchema },
    ]),
  ],
  controllers: [RabbitmqConsumerController],
  providers: [RabbitmqConsumerService],
})
export class RabbitmqConsumerModule {}
