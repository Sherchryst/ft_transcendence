import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class Jwt2faGuard extends AuthGuard('jwt-2fa') {}

@Injectable()
export class WsJwt2faGuard extends AuthGuard('ws-jwt-2fa') {}