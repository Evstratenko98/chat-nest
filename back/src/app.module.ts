import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbEntities } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'db-chat-nest',
        port: parseInt(configService.get('DB_PORT')) || 5432,
        username: 'db-chat-nest',
        password: 'db-chat-nest',
        database: 'db-chat-nest',
        entities: dbEntities,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
