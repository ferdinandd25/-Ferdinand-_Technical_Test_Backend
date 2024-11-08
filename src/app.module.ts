import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadModule } from './lead/lead.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RabbitmqProducerModule } from './rabbitmq-producer/rabbitmq-producer.module';
import { RabbitmqConsumerModule } from './rabbitmq-consumer/rabbitmq-consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    LeadModule,
    UserModule,
    AuthModule,
    RabbitmqProducerModule,
    RabbitmqConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
