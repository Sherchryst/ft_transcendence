import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { Board } from './interfaces/board.interface';
import { MatchService } from './match.service';
import { CustomJwtService, getJwtFromSocket } from 'src/auth/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { WsJwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { Req, UseGuards } from '@nestjs/common';

const interval = 20;
var calc = false;
const speed = 1;
var boards = new Map<string, Board>();
const basic_board : Board = {
	ball: {
    x: 50,
    y: Math.random() * 50 + 25,
    half_width: 2,
    dx: speed * (Math.floor(Math.random() * 2)? -1:1), //random player
    dy: Math.random() * speed * 1.5 * (Math.floor(Math.random() * 2)? -1:1) }, //random top/bottom
  player: [{
    user_id : "player1",
    id: 0,
    y: 50,
    old_y: 50,
    score : 0,
    half_height : 6 },{
    user_id : "player2",
    id: 1,
    y: 50,
    old_y: 50,
    score : 0,
    half_height : 6 }],
	dead : false,
  bot : true,
  bot_speed : 3,
  bot_offset : 0,
	end : false,
  pass_count : 0,
  new_game : true,
  update_needed : true
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@UseGuards(WsJwt2faGuard)
@WebSocketGateway(3001, { namespace : "game" })
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server : Server;
  constructor(private readonly gameService : GameService,
    private readonly matchService : MatchService,
    private readonly customJwtService: CustomJwtService,
    private readonly usersService: UsersService) {}

  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }

  async handleConnection(@ConnectedSocket() socket : Socket) {
    try {
      let jwt = getJwtFromSocket(socket);
      const payload = this.customJwtService.verify(jwt);
      const user = await this.usersService.findOne(payload.sub);
      if (user.twofa && !payload.isSecondFactorAuth)
        throw new WsException("");
    }
    catch {
      console.log("Game: Unauthorized connection");
      socket.disconnect(false);
      return;
    }
    console.log("connection to game... id :", socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket : Socket) {
    // --> put score of other player to 11 in bd
    console.log("disconnection from game : ", socket.id);
  }

  @SubscribeMessage('connection')
  async handleMessage(
    @Req() req,
    @MessageBody() id: string,
    @ConnectedSocket() socket: Socket) {
    boards.set(socket.id, JSON.parse(JSON.stringify(basic_board)));
    var map = await this.matchService.findMap(1);
    if (!map)
      map = {
        id: 1,
        ballColor: 16562691,
        backgroundColor: 344663,
        starsColor: 12566194,
        racketColor: 16777215
      };
    this.server.to(socket.id).emit("id" , { id: 0, map: map });
    this.server.to(socket.id).emit("login" , { id: 0, login: req.user.login });
    //       var match = await this.matchService.createMatch(map, user, null, MatchType.CASUAL);
    this.sendUpdateBoard(socket);
  }

  @SubscribeMessage('player')
  handlePlayer(
  @MessageBody() tmp: Player,
  @ConnectedSocket() socket: Socket) {
    var board = boards.get(socket.id);
    if (!board)
      return ;
    this.gameService.updatePlayer(0, tmp.y, board);
  }

  async sendUpdateBoard(socket: Socket) {
    var timer = 0;
    var board = boards.get(socket.id);
    this.gameService.reset(true, board);
    while (!board.end)
    {
      await sleep(interval);
      if (board.new_game)
      {
        await sleep(1000);
        board.new_game = false;
      }
      this.server.to(socket.id).emit('board', this.gameService.updateBall(board));
      if (!(timer % 200))
        board.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random()
          * board.player[1].half_height * 1.2 * board.ball.dx;
      timer++;
    }
    // update game in bdd --> end of match
    boards.delete(socket.id);
  }
}
