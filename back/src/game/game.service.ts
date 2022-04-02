import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './interfaces/board.interface';
import { Racket } from './interfaces/racket.interface';

const speed = 0.5;
const max_x = 1 / Math.sqrt(10.0);
const max_y = 3 * max_x;
const width = 100;
const height = 100;

@Injectable()
export class GameService
{
	racket: Racket = {
		width: 2,
		x : [6,94]
	}
	updatePlayer(id : number, y : number, board : Board)
	{
		var player = board.player[id];
		if (y < player.half_height) // check if the racket position runs out of the canvas
            player.y = player.half_height;
        else if (y >= height - player.half_height)
            player.y = height - player.half_height;
		else
			player.y = y;
	}
	racketCollision(dist, idx, racket_dy, board : Board)
	{
		board.pass_count++;
		var ball = board.ball;
		if (!(board.pass_count % 10))
		{
			board.player[0].half_height *= .9;
			board.player[1].half_height *= .9;
		}
		else if (!(board.pass_count % 5))
			ball.half_width *= 0.9
		ball.dx *= -1.05;
    ball.dy = 1.05 * ball.dy + racket_dy
        + dist * Math.abs(ball.dx) / board.player[idx].half_height;
		if (Math.abs(ball.dx) * 2 < Math.abs(ball.dy))
			ball.dy = 2 * Math.sign(ball.dy) * Math.abs(ball.dx);
	}
	updateBall(board : Board) : Board
	{
		var ball = board.ball;
		const racket = this.racket;
		var player = ball.dx < 0? 0 : 1;
		var tmpx = ball.x + ball.dx;
		var tmpy = ball.y + ball.dy;
		if (tmpy - ball.half_width < 0
		|| tmpy + ball.half_width >= height) // wall collision
				ball.dy = -ball.dy;
		else if ((player == 0 && tmpx - ball.half_width < racket.x[0])
		|| (player == 1 && tmpx + ball.half_width >= racket.x[1]))
		{
			var dist = tmpy - board.player[player].y;
      var racket_dy = board.player[player].y - board.player[player].old_y;
			if (Math.abs(dist) <= board.player[player].half_height + ball.half_width && !board.dead) //racket collision
				this.racketCollision(dist, player, racket_dy, board);
			else if (tmpx < -ball.half_width
				|| tmpx  >= width + ball.half_width) //ball out of map
			{
				board.player[player? 0 : 1].score++;
				this.reset(board);
			}
    // else if ((tmpx > racket.x[0] - racket.width - (ball.half_width * 2)
      // || tmpx <= racket.x[1] + racket.width + (ball.half_width * 2))
      // && Math.abs(dist) <= this.board.player[player].half_height + ball.half_width
      // && Math.sign(dist) == Math.sign(ball.dy)
      // && (Math.sign(dist) == Math.sign(racket_dy) || racket_dy < 0.001)) //ball side of racket
      // {
      // 	ball.dy = Math.abs(ball.dy) * Math.sign(dist) + racket_dy;
      // 	if (Math.abs(ball.dx) * 2 < Math.abs(ball.dy))
      // 		ball.dy = 2 * Math.sign(ball.dy) * Math.abs(ball.dx);
      // 	// ball.dy = -1 * Math.sign(dist) + ball.dy + (Math.sign(dist) != Math.sign(racket_dy)? racket_dy:0);
      // 	ball.y = this.board.player[player].y + Math.sign(dist) * (ball.half_width + this.board.player[player].half_height);
      // 	if (ball.y < ball.half_width)
      // 		ball.y = ball.half_width;
      // 	else if (ball.y > height - ball.half_width)
      // 		ball.y = height - ball.half_width;
      // 	this.board.dead = true;
      // }
			else //ball behind racket
			{
				this.moveBall(board)
        if (tmpx < racket.x[0]
          || tmpx >= racket.x[1])
				  board.dead = true;
			}
		}
		else
			this.moveBall(board);
		board.player[0].old_y = board.player[0].y;
		board.player[1].old_y = board.player[1].y;
		return board ;
	}
	moveBall(board : Board)
	{
		var ball = board.ball;
		ball.x += ball.dx;
		ball.y += ball.dy;
		// this.updatePlayer(1, ball.y, board);
		// this.updatePlayer(0, ball.y, board);
	}
	reset(board : Board)
	{
		if (board.player[0].score >= 11 || board.player[1].score >= 11)
			board.end = true;
		board.new_round = true;
		board.dead = false;
    board.ball.dx = speed * (board.ball.x < width / 2? -1:1);
    board.ball.dy = Math.random() * speed * 1.5 * (Math.floor(Math.random() * 2)? -1:1);
        board.ball.x = 50;
        board.ball.y = Math.random() * height / 2 + height / 4;
    board.ball.half_width = 2;
		board.player[0].half_height = 6;
		board.player[1].half_height = 6;
		board.pass_count = 0;
	}
}
