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
import { switchMap } from 'rxjs';
import { GameMap } from './entities/game-map.entity';

const interval = 20;
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
	end : false,
  pass_count : 0,
  ready : false,
  pause_counter : 50
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
      var map = await this.matchService.findGameMap(data.mapId)
      const invitation = await this.matchService.createMatchInvitation(req.user.id, to_user.id, map);
      // console.log("invitation", invitation)
      console.log("invitation sent to ", to_user.login);
      // while(!this.WsClients.has(to_user.id))
      //   await sleep(5000);
      this.WsClients.get(to_user.id).emit("invited", invitation);
    }
  }

  createBoard(id : number, player1 : string, player2 : string) : Board {
    var board = JSON.parse(JSON.stringify(basic_board));
    board.player[0].user_id = player1;
    board.player[1].user_id = player2;
    boards.set("" + id, board);
    return board;
  }

  async createMatch(map: GameMap, player1: number, player2: number | null, matchType: MatchType,
  @ConnectedSocket() socket: Socket) : Promise<Match> {
    console.log("Create match : map", map);
    if (Math.random() < 0.5)
    {
      const tmp = player1;
      player1 = player2;
      player2 = tmp;
    }
    const match = await this.matchService.createMatch(map, player1, player2, matchType);
    console.log("Match created : (in create match) ", match);
    const player1_socket =  this.WsClients.get(match.player1.id);
    const player2_socket =  this.WsClients.get(match.player2.id);
    this.createBoard(match.id, player1_socket.id, player2_socket.id);
    player1_socket.join(`game:${match.id}`);
    player2_socket.join(`game:${match.id}`);
    this.server.to(`game:${match.id}`).emit("gameStart", match.id);
    return match;
  }

  @SubscribeMessage('matchmaking')
  async handleMatchmaking(
  @Req() req,
  @ConnectedSocket() socket: Socket) {
    if (pending_player >= 0 && pending_player != req.user.id)
    {
      const map = await this.matchService.findGameMap(1); 
      await this.createMatch(map, pending_player, req.user.id, MatchType.RANKED, socket);
      pending_player = -1;
    }
    else
      pending_player = req.user.id;
  }

  @SubscribeMessage('acceptInvit')
  async handleAcceptInvit(
  @Req() req,
  @MessageBody() data: any,
  @ConnectedSocket() socket: Socket) {
    // console.log("data", data);
    const matchInvit = await this.matchService.findMatchInvitation(data.to.id, data.from.id);
    if (matchInvit == null)
      console.log("No invitation found");
    else
    {
      console.log("Invitation accepted : ", matchInvit);
      await this.createMatch(matchInvit.map, matchInvit.to.id, matchInvit.from.id, MatchType.CASUAL, socket);
      await this.matchService.deleteMatchInvitation(data.from.id, data.to.id);
    }
    // console.log("match_id (acceptInvit): ", boards);
  }

  @SubscribeMessage('connection')
  async handleMessage(
  @Req() req,
  @MessageBody() id: number,
  @ConnectedSocket() socket: Socket) {
    // console.log("match_id (connection): ", id);

    var board = boards.get("" + id);
    var player_id;

    if (board.player[0].user_id == socket.id)
    player_id = 0;
    else if (board.player[1].user_id == socket.id)
    player_id = 1;
    else
    player_id = 2;
    const match = await this.matchService.findMatch(id);
    console.log("match", match, "map", match.map);
    socket.emit("gameMap", { id : player_id, map : match.map, login : [match.player1.login, match.player2.login] }); //change to specific map
    if (player_id == 0) {
      while (board.ready == false) // wait for other player to join
        await sleep(500);
      console.log("new match ", id, ": ", match.player1.login, " vs ", match.player2.login);
      this.sendUpdateBoard(id);
    }
    else if (player_id == 1) // player 2 is ready
      board.ready = true;
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
  @MessageBody() data: { match_id: number, id: number, y: number }) {
    // console.log("match_id (player): ", data.match_id);
    if (data.id != 0 && data.id != 1)
      return;
    var board = boards.get("" + data.match_id); //match id
    if (!board )
      return ;
      //check player id
    this.gameService.updatePlayer(data.id, data.y, board);
  }

  async sendUpdateBoard(id: number) {
    var board = boards.get("" + id);
    // console.log("id : \n", id, "boards :\n", boards, "board:", board);
    while (!board.end)
    {
      await sleep(interval);
      if (board.pause_counter > 0)
      {
        if (board.pause_counter == 1)
          this.matchService.updateScore(id, board.player[0].score, board.player[1].score);
        board.pause_counter--;
      }
      else
        this.gameService.updateBall(board);
      this.server.to(`game:${id}`).emit('board', board);
    }
    const match = await this.matchService.findMatch(id);
    this.matchService.setWinner(id, board.player[0].score > board.player[1].score ?
    match.player1.id : (match.player2? match.player2.id : -1));
    this.matchService.updateScore(id, board.player[0].score, board.player[1].score);
    console.log("match ", id, "ended, score: ", board.player[0].score, " - ", board.player[1].score);
    boards.delete("" + id);
  }
}
