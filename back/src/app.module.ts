import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + "/migrations/*{.ts,.js}"],
      synchronize: true
    }),
    AuthModule,
    // ChatModule,
    UsersModule,
    GameModule
  ]
})
export class AppModule {}
