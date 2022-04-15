import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Board } from "./interfaces/board.interface";
import { Racket } from "./interfaces/racket.interface";

const width = 100;
const height = 100;

@Injectable()
export class GameService {
  WsClients = new Map<number, Socket>();
  racket: Racket = {
    width: 2,
    x: [6, 94],
  };
  updatePlayer(id: number, y: number, board: Board) {
    const player = board.player[id];
    if (y < player.half_height)
      // check if the racket position runs out of the canvas
      player.y = player.half_height;
    else if (y >= height - player.half_height)
      player.y = height - player.half_height;
    else player.y = y;
  }
  racketCollision(dist: number, idx: number, racket_dy: number, board: Board) {
    const ball = board.ball;
    const speed_factor = Math.abs(ball.dx) > 2 ? 1 : 1.05;
    ball.dx *= -speed_factor;
    ball.dy =
      speed_factor * ball.dy +
      racket_dy +
      (dist * Math.abs(ball.dx)) / board.player[idx].half_height;
    if (Math.abs(ball.dx) * 2 < Math.abs(ball.dy))
      ball.dy = 2 * Math.sign(ball.dy) * Math.abs(ball.dx);
  }
  updateBall(board: Board): Board {
    const ball = board.ball;
    const racket = this.racket;
    const player = ball.dx < 0 ? 0 : 1;
    const tmpx = ball.x + ball.dx;
    const tmpy = ball.y + ball.dy;
    if (tmpy - ball.half_width < 0 || tmpy + ball.half_width >= height)
      // wall collision
      ball.dy = -ball.dy;
    else if (
      (player == 0 && tmpx - ball.half_width < racket.x[0]) ||
      (player == 1 && tmpx + ball.half_width >= racket.x[1])
    ) {
      const dist = tmpy - board.player[player].y;
      const racket_dy = board.player[player].y - board.player[player].old_y;
      if (
        Math.abs(dist) <= board.player[player].half_height + ball.half_width &&
        !board.dead
      )
        //racket collision
        this.racketCollision(dist, player, racket_dy, board);
      else if (tmpx < -ball.half_width || tmpx >= width + ball.half_width) {
        //ball out of map
        board.player[player ? 0 : 1].score++;
        this.reset(board);
      } //ball behind racket
      else {
        this.moveBall(board);
        if (tmpx < racket.x[0] || tmpx >= racket.x[1]) board.dead = true;
      }
    } else this.moveBall(board);
    board.player[0].old_y = board.player[0].y;
    board.player[1].old_y = board.player[1].y;
    return board;
  }
  moveBall(board: Board) {
    const ball = board.ball;
    ball.x += ball.dx;
    ball.y += ball.dy;
    // this.updatePlayer(1, ball.y, board);
    // this.updatePlayer(0, ball.y, board);
  }
  reset(board: Board) {
    if (board.player[0].score >= 11 || board.player[1].score >= 11)
      board.end = true;
    board.pause_counter = 50;
    board.dead = false;
    board.ball.dx = board.ball.x < width / 2 ? -1 : 1;
    board.ball.dy =
      Math.random() * 1.5 * (Math.floor(Math.random() * 2) ? -1 : 1);
    board.ball.x = 50;
    board.ball.y = (Math.random() * height) / 2 + height / 4;
    board.ball.half_width = 2;
    board.player[0].half_height = 6;
    board.player[1].half_height = 6;
    if (board.level != 2) {
      board.ball.dx *= board.level / 2;
      board.ball.dy *= board.level / 2;
      board.player[0].half_height *= 2 / board.level;
      board.player[1].half_height *= 2 / board.level;
    }
  }
}
