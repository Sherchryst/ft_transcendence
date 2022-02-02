import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { In } from 'typeorm';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class Jwt2faGuard extends AuthGuard('jwt-2fa') {}