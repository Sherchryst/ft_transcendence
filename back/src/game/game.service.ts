import { Injectable, NotFoundException } from '@nestjs/common';
// import { randomBytes } from 'crypto';
import { Board } from './interfaces/board.interface';
import { Dimensions } from './interfaces/dimensions.interface';
import { User } from 'src/users/entities/user.entity';
import { getRepository } from 'typeorm';
import { Game } from './entities/game.entity';

const speed = 1;
const bot_speed = 3;
const max_x = 1 / Math.sqrt(10.0);
const max_y = 3 * max_x;
const width = 100;
const height = 100;
var pass_count = 0;
// const min = [9 * Math.PI / 16, 23 * Math.PI / 16];
// const max = [25 * Math.PI / 16, 7 * Math.PI / 16];
const basic_board : Board = {
	ball: {
		x: 50,
		y: 50,
		half_width: 1.5,
		dx: speed * (Math.floor(Math.random() * 2)? -1:1), //random player
		dy: speed * (2/3) * (Math.floor(Math.random() * 2)? -1:1) }, //random top/bottom
	player: [{
		id: 0,
		y: 50,
		old_y: 50,
		score : 0,
		half_height : 6 },{
		id: 1,
		y: 50,
		old_y: 50,
		score : 0,
		half_height : 6 }],
	dead : false,
	end : false
	}

@Injectable()
export class GameService
{
	bot : boolean = true;
	// constructor(private socket: Socket){}
	dimensions: Dimensions = {
		canvas: {
			height : height,
			width : width},
		racket: {
			width: 2,
			x : [6,94]
		}
	}
	new_game : boolean = true;
	bot_offset : number = 0;
    board: Board = basic_board;
	async createGame(player1: User, player2: User, map: number): Promise<Game> {
		const game = getRepository(Game).create({
		  player1: player1,
		  player2: player2,
		  map : map
		});
		await getRepository(Game).save(game);
		return game;
	}
	async deleteGame(gameId: number) {
		await getRepository(Game).delete({ id: gameId });
	}
	async updateGame(game: Game): Promise<Game> {
		return getRepository(Game).save(game);
	}
	updatePlayer(id : number, y : number)
	{
		if (id > 1)
			return new NotFoundException('no player with this id');
		var player = this.board.player[id];
		if (y < player.half_height) // check if the racket position runs out of the canvas
            player.y = player.half_height;
        else if (y >= height - player.half_height)
            player.y = height - player.half_height;
		else
			player.y = y;
	}
	racketCollision(dist, idx)
	{
		pass_count++;
		var ball = this.board.ball;
		// var ball_speed = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));
		if (!(pass_count % 10))
		{
			this.board.player[0].half_height *= .9;
			this.board.player[1].half_height *= .9;
		}
		else if (!(pass_count % 5))
			ball.half_width *= 0.9
		ball.dx *= -1.05;
		ball.dy = 1.05 * ball.dy + (this.board.player[idx].y - this.board.player[idx].old_y);
		// var collideAngle = dist * Math.sign(ball.dx) * Math.PI / (2 * this.board.player[idx].half_height);
		// console.log("VECTOR SPEED BEF COLL" ,Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2)));
		ball.dy += dist * Math.abs(ball.dx) / this.board.player[idx].half_height;
			// var new_dx = ball.dx * Math.cos(collideAngle) - ball.dy * Math.sin(collideAngle); 
			// var new_dy = ball.dx * Math.sin(collideAngle) + ball.dy * Math.cos(collideAngle);
			// console.log("VECTOR SPEED AFTER COLL :", Math.sqrt(Math.pow(new_dx, 2) + Math.pow(new_dy, 2)));
		if (Math.abs(ball.dx) * 2 < Math.abs(ball.dy))
			ball.dy = 2 * Math.sign(ball.dy) * Math.abs(ball.dx);
			// && Math.sign(ball.dx) == Math.sign(new_dx)) // limits the angle of collision of the ball
			// {
			// 	ball.dx = new_dx;
			// 	ball.dy = new_dy;
			// }
			// else
			// {
			// 	ball.dx = Math.sign(ball.dx) * max_x * ball_speed;
			// 	ball.dy = Math.sign(ball.dy) * max_y * ball_speed;
			// 	// console.log("EXTREME ANGLE", Math.sign(ball.dx));
			// }
			// console.log("VECTOR SPEED AFTER COLL" , Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2)));
	}
    updateBall() : Board
    {
		var ball = this.board.ball;
		const dim = this.dimensions;
		var tmpx = ball.x + ball.dx;
		var tmpy = ball.y + ball.dy;
		if (tmpy - ball.half_width < 0
		|| tmpy + ball.half_width >= height) // wall collision
				ball.dy = -ball.dy;
		else if (tmpx - ball.half_width < dim.racket.x[0]
		|| tmpx + ball.half_width >= dim.racket.x[1])
		{
			var player = ball.dx < 0? 0 : 1;
			var dist = tmpy - this.board.player[player].y;
			if (Math.abs(dist) <= this.board.player[player].half_height + ball.half_width && !this.board.dead) //racket collision
				this.racketCollision(dist, player);
			else if (tmpx < -ball.half_width
				|| tmpx  >= width + ball.half_width) //ball out of map
			{
				this.board.player[player? 0 : 1].score++;
				this.reset(false);
			}
			else //ball behind racket
			{
				this.moveBall()
				this.board.dead = true;
			}
		}
		else
			this.moveBall();
		this.board.player[0].old_y = this.board.player[0].y;
		this.board.player[1].old_y = this.board.player[1].y;
		return this.board;
    }
	moveBall()
	{
		var ball = this.board.ball;
		ball.x += ball.dx;
		ball.y += ball.dy;
		if (this.bot && !this.board.dead && ball.dx > 0) // move Bot only if the ball goes in his direction
		{
			const weight = (this.dimensions.racket.x[1] - ball.x) / this.dimensions.canvas.width;
			var dy = (weight * this.dimensions.canvas.height / 2 + (1 - weight) * this.board.ball.y + this.bot_offset);
			dy -= this.board.player[1].y; // < dy ? 1 : -1;
			// var dy = (ball.dy)/2 + (ball.y - this.board.player[1].y) / speed;
			this.updatePlayer(1, this.board.player[1].y + (Math.abs(dy) > Math.abs(bot_speed) ? bot_speed * Math.sign(dy) : dy)); //limit speed of bot
		}
		// this.updatePlayer(1, ball.y);
		// this.updatePlayer(0, ball.y);
	}
    reset(all : boolean)
    {
		if (all) // for testing only
		{
			this.board.player[0].score = 0;
			this.board.player[1].score = 0;
			this.board.end = false;
		}
		else if (this.board.player[0].score >= 11 || this.board.player[1].score >= 11)
			this.board.end = true;
		this.new_game = true;
		this.board.dead = false;
		this.board.ball.dx = speed * (this.board.ball.x < this.dimensions.canvas.width / 2? -1:1);
		this.board.ball.dy = speed * (2/3) * (Math.floor(Math.random() * 2)? -1:1);
        this.board.ball.x = 50;
        this.board.ball.y = height / 2;
        // this.board.player[0].y = height / 2;
        // this.board.player[1].y = height / 2;
		this.board.ball.half_width = 1.5;
		this.board.player[0].half_height = 6;
		this.board.player[1].half_height = 6;
		pass_count = 0;
    }
}
