import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { Board } from './interfaces/board.interface';

@Controller('game') // listen on localhost:3000/game
export class GameController
{
	constructor(private readonly gameService : GameService)
	{}
	// @Get('board')
	// findBoard()
	// {
	// 	return this.gameService.findBoard();
	// }
	// @Patch(':id')
	// updatePlayer(@Param('id') id : number, @Body() y : number)
	// {
	// 	return this.gameService.updatePlayer(id, y);
	// }
}
