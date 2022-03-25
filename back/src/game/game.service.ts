import { ExceptionFilter, Injectable, NotFoundException } from '@nestjs/common';
// import { randomBytes } from 'crypto';
import { Board } from './interfaces/board.interface';
import { Dimensions } from './interfaces/dimensions.interface';
// import { ServerEngine } from 'lance-gg';

const speed = 1;
const max_x = 1 / Math.sqrt(10.0);
const max_y = 3 * max_x;
const width = 100;
const height = 100;
// const min = [9 * Math.PI / 16, 23 * Math.PI / 16];
// const max = [25 * Math.PI / 16, 7 * Math.PI / 16];

@Injectable()
export class GameService
{
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
	updatePlayer(id : number, y : number, board : Board) : Board
	{
		if (id > 1)
			return board;
		// 	return new NotFoundException('no player with this id');
		var player = board.player[id];
		if (y < player.half_height) // check if the racket position runs out of the canvas
            player.y = player.half_height;
        else if (y >= height - player.half_height)
            player.y = height - player.half_height;
		else
			player.y = y;
		return board;
	}
	racketCollision(dist, idx, board : Board)
	{
		board.pass_count++;
		var ball = board.ball;
		// var ball_speed = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));
		if (!(board.pass_count % 10))
		{
			board.player[0].half_height *= .9;
			board.player[1].half_height *= .9;
		}
		else if (!(board.pass_count % 5))
			ball.half_width *= 0.9
		ball.dx *= -1.05;
		ball.dy = 1.05 * ball.dy + (board.player[idx].y - board.player[idx].old_y);
		// var collideAngle = dist * Math.sign(ball.dx) * Math.PI / (2 * board.player[idx].half_height);
		// console.log("VECTOR SPEED BEF COLL" ,Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2)));
		ball.dy += dist * Math.abs(ball.dx) / board.player[idx].half_height;
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
    updateBall(board : Board) : Board
    {
		var ball = board.ball;
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
			var dist = tmpy - board.player[player].y;
			if (Math.abs(dist) <= board.player[player].half_height + ball.half_width && !board.dead) //racket collision
				this.racketCollision(dist, player, board);
			else if (tmpx < -ball.half_width
				|| tmpx  >= width + ball.half_width) //ball out of map
			{
				board.player[player? 0 : 1].score++;
				this.reset(false, board);
			}
			else //ball behind racket
			{
				this.moveBall(board)
				board.dead = true;
			}
		}
		else
			this.moveBall(board);
		board.player[0].old_y = board.player[0].y;
		board.player[1].old_y = board.player[1].y;
		return board;
    }
	moveBall(board : Board)
	{
		var ball = board.ball;
		ball.x += ball.dx;
		ball.y += ball.dy;
		if (board.bot && !board.dead && ball.dx > 0) // move Bot only if the ball goes in his direction
		{
			const weight = (this.dimensions.racket.x[1] - ball.x) / this.dimensions.canvas.width;
			var dy = (weight * this.dimensions.canvas.height / 2 + (1 - weight) * board.ball.y + board.bot_offset);
			dy -= board.player[1].y; // < dy ? 1 : -1;
			// var dy = (ball.dy)/2 + (ball.y - board.player[1].y) / speed;
			this.updatePlayer(1, board.player[1].y + (Math.abs(dy) > Math.abs(board.bot_speed) ? board.bot_speed * Math.sign(dy) : dy), board); //limit speed of bot
		}
		// this.updatePlayer(1, ball.y);
		// this.updatePlayer(0, ball.y);
	}
    reset(all : boolean, board : Board) : Board
    {
		if (all) // for testing only
		{
			board.player[0].score = 0;
			board.player[1].score = 0;
			board.end = false;
		}
		else if (board.player[0].score >= 11 || board.player[1].score >= 11)
			board.end = true;
		board.new_game = true;
		board.dead = false;
		board.ball.dx = speed * (board.ball.x < this.dimensions.canvas.width / 2? -1:1);
		board.ball.dy = speed * (2/3) * (Math.floor(Math.random() * 2)? -1:1);
        board.ball.x = 50;
        board.ball.y = height / 2;
        // board.player[0].y = height / 2;
        // board.player[1].y = height / 2;
		board.ball.half_width = 1.5;
		board.player[0].half_height = 6;
		board.player[1].half_height = 6;
		board.pass_count = 0;
		return board;
    }
}
