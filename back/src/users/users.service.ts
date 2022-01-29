import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(userDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update({id: userId}, {
      twoFactorAuthenticationSecret: secret
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update({id: userId}, {
      isTwoFactorAuthenticationEnabled: true
    });
  }

}
