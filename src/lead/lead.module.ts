import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead, LeadSchema } from 'src/schemas/lead.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { RabbitmqProducerModule } from 'src/rabbitmq-producer/rabbitmq-producer.module';
import { UserModule } from 'src/user/user.module';
import {
  LeadHistory,
  LeadHistorySchema,
} from 'src/schemas/lead-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: LeadHistory.name, schema: LeadHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule,
    RabbitmqProducerModule,
    UserModule,
  ],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
