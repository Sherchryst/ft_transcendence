import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { Board } from './interfaces/board.interface';

@Controller('game')
export class GameController
{
	constructor(private readonly gameService : GameService)
	{}
}
