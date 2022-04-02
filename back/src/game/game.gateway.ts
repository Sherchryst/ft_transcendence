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
import { match } from 'assert';
import { Match, MatchType } from './entities/match.entity';
import { MatchInvitation } from './entities/match-invitation.entity';

const interval = 20;
var calc = false;
var pending_player = -1;
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
  bot : false,
  bot_speed : 3,
  bot_offset : 0,
	end : false,
  pass_count : 0,
  new_round : false,
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@UseGuards(WsJwt2faGuard)
@WebSocketGateway(3001, { namespace : "game" })
export class GameGateway implements OnGatewayConnection {
  static startGame(id: any) {
    throw new Error('Method not implemented.');
  }

  WsClients = new Map<number, Socket>();

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
      // console.log("allo", user.id, socket.id, this.WsClients)
      this.WsClients.set(user.id, socket);
    }
    catch(reason) {
      console.log("Game: Unauthorized connection", reason);
      socket.disconnect(false);
      return;
    }
    console.log("connection to game... id :", socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket : Socket, @Req() req) {
    // --> put score of other player to 11 in bd
    // this.WsClients.delete(req.user?.id);
    console.log("disconnection from game : ", socket.id);
  }

  @SubscribeMessage('invite')
  async handleInvite(
  @Req() req,
  @MessageBody() data: {login: string, mapId: number}) {
    const to_user = await this.usersService.findByLogin(data.login);
    if (to_user == null)
      console.log("User not found");
    else if (data.login == req.user.login)
      console.log("You can't invite yourself");
    else
    {
      var map = await this.matchService.findMap(data.mapId)
      const invitation = await this.matchService.createMatchInvitation(req.user.id, to_user.id, map);
      // console.log("invitation", invitation)
      console.log("invitation sent to ", to_user.login);
      // while(!this.WsClients.has(to_user.id))
      //   await sleep(5000);
      this.WsClients.get(to_user.id).emit("invited", invitation);
    }
  }

  async createMatch(mapId: number, player1: number, player2: number | null, matchType: MatchType,
  @ConnectedSocket() socket: Socket) : Promise<Match> {
    const map = await this.matchService.findMap(mapId);
    const match = await this.matchService.createMatch(map, player1, player2, matchType);
    boards.set("" + match.id, JSON.parse(JSON.stringify(basic_board)));
    var board = boards.get("" + match.id);
    board.player[0].user_id = this.WsClients.get(match.player1.id).id;
    if (player2 != null)
    {
      const player2_socket =  this.WsClients.get(match.player2.id);
      board.player[1].user_id = player2_socket.id;
      player2_socket.join(`game:${match.id}`);
    }
    else
    {
      board.player[1].user_id = "";
      board.bot = true;
      board.new_round = true;
    }
    socket.join(`game:${match.id}`);
    this.server.to(`game:${match.id}`).emit("gameStart", match.id);
    return match;
  }
  
  @SubscribeMessage('bot')
  async handleBot(
  @Req() req,
  @ConnectedSocket() socket: Socket) {
    await this.createMatch(1, req.user.id, null, MatchType.CASUAL, socket);
  }

  @SubscribeMessage('matchmaking')
  async handleMatchmaking(
  @Req() req,
  @ConnectedSocket() socket: Socket) {
    if (pending_player >= 0 && pending_player != req.user.id)
    {
      await this.createMatch(1, req.user.id, pending_player, MatchType.RANKED, socket);
      pending_player = -1;
    }
    else
      pending_player = req.user.id;
  // console.log("match_id (bot): ", match.id);
  }

  @SubscribeMessage('acceptInvit')
  async handleAcceptInvit(
  @Req() req,
  @MessageBody() data: any,
  @ConnectedSocket() socket: Socket) {
    // console.log("data", data);
    await this.createMatch(data.mapId, data.to.id, data.from.id, MatchType.CASUAL, socket);
    await this.matchService.deleteMatchInvitation(data.from.id, data.to.id);
    // console.log("match_id (acceptInvit): ", boards);
  }

  @SubscribeMessage('connection')
  async handleMessage(
  @Req() req,
  @MessageBody() id: number,
  @ConnectedSocket() socket: Socket) {
    // console.log("match_id (connection): ", id);
    const match =  await this.matchService.findMatch(id);
    var player_id;
    var board = boards.get("" + id);
    if (board.player[0].user_id == socket.id)
      player_id = 0;
    else if (board.player[1].user_id == socket.id)
      player_id = 1;
    else
      player_id = 2;
    this.server.to(socket.id).emit("gameMap", { id : player_id, map : await this.matchService.findMap(1), login : [match.player1.login, match.player2 ? match.player2.login : "BOT"] });
    if (player_id == 0)
    {
      while (board.new_round == false) // wait for other player to join
        await sleep(500);
      console.log("new match ", id, ": ", match.player1.login, " vs ", match.player2 ? match.player2.login : "BOT");
      this.sendUpdateBoard(id);
    }
    else if (player_id == 1) // player 2 is ready
      board.new_round = true;
  }

  @SubscribeMessage('leave')
  async handleLeave(
  @MessageBody() data: any,
  @ConnectedSocket() socket: Socket,
  @Req() req) {
    console.log("match_id (leave): ", data.match_id);
    try {
      var board = boards.get("" + data.match_id);
      if ((data.id == 0 || data.id == 1) && board.player[data.id].user_id == socket.id)
      {
        board.player[data.id == 0? 1 : 0].score = 11;
        board.end = true;
        this.server.to(`game:${data.match_id}`).emit('board', this.gameService.updateBall(board));
      }
      this.server.socketsLeave(`game:${data.match_id}`);
    }
    catch (e) {
      console.log("left game");
    }
  }

  @SubscribeMessage('player')
  handlePlayer(
  @MessageBody() tmp: { match_id: number, id: number, y: number }) {
    // console.log("match_id (player): ", tmp.match_id);
    var board = boards.get("" + tmp.match_id); //match id
    if (!board)
      return ;
      //check player id
    this.gameService.updatePlayer(tmp.id, tmp.y, board);
  }

  async sendUpdateBoard(id: number) {
    var timer = 0;
    var board = boards.get("" + id);
    // console.log("id : \n", id, "boards :\n", boards, "board:", board);
    while (!board.end)
    {
      await sleep(interval);
      if (board.new_round)
      {
        await sleep(1000);
        this.matchService.updateScore(id, board.player[0].score, board.player[1].score);
        board.new_round = false;
      }
      this.server.to(`game:${id}`).emit('board', this.gameService.updateBall(board));
      if (!(timer % 200))
        board.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random()
          * board.player[1].half_height * 1.2 * board.ball.dx;
      timer++;
    }
    const match =  await this.matchService.findMatch(id);
    this.matchService.setWinner(id, board.player[0].score > board.player[1].score ?
    match.player1.id : (match.player2? match.player2.id : -1));
    this.matchService.updateScore(id, board.player[0].score, board.player[1].score);
    console.log("match ", id, "ended, score: ", board.player[0].score, " - ", board.player[1].score);
    boards.delete("" + id);
  }
}
