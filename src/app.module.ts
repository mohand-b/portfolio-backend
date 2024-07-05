import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsService } from './questions/questions.service';
import { Question } from './questions/question.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContactController } from './contact/contact.controller';
import { ContactService } from './contact/contact.service';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './environments/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Question],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Question]),
  ],
  controllers: [ContactController, QuestionsController],
  providers: [ContactService, MailService, QuestionsService],
})
export class AppModule {}
