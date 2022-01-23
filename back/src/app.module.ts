import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

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
      entities: [__dirname  + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + "/migrations/*{.ts,.js}"],
      synchronize: true
    }),
    AuthModule
  ]
})
export class AppModule {}
