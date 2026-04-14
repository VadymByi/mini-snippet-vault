import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
  imports: [
    // 1. Подключаем ConfigModule глобально, чтобы иметь доступ к .env во всем приложении
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Подключаем MongoDB асинхронно, чтобы дождаться загрузки конфига
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    SnippetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
