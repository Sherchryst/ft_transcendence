import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { Board } from './interfaces/board.interface';
import { MatchService } from './match.service';

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

@WebSocketGateway(3001, { namespace : "game" })
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server : Server;
  constructor(private readonly gameService : GameService,
    private readonly matchService : MatchService) {}

  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }

  handleConnection(@ConnectedSocket() socket : Socket) {
      console.log("connection to game... id :", socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket : Socket) {
    const id : string = socket.id;
    if (boards.get(id).player[0].score == 11 || boards.get(id).player[1].score == 11)
      boards.delete(id); // tmp solution, will change when db is set
    console.log("disconnection from game : ", id);
  }

  @SubscribeMessage('connection')
  async handleMessage(
    @MessageBody() id: string,
    @ConnectedSocket() socket: Socket) {
    boards.set(socket.id, basic_board);
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
    //       var match = await this.matchService.createMatch(map, user, null, MatchType.CASUAL);
    this.sendUpdateBoard(socket);
  }

  @SubscribeMessage('player')
  handlePlayer(
    @MessageBody() tmp: Player,
    @ConnectedSocket() socket: Socket) {
      if (!boards.has(socket.id))
        return ;
      var tmp_board : Board = JSON.parse(JSON.stringify(boards.get(socket.id)));
      boards.set(socket.id, this.gameService.updatePlayer(0, tmp.y, tmp_board));
  }
  async sendUpdateBoard(socket: Socket) {
    var timer = 0;
    if (!boards.has(socket.id))
        return ;
    var tmp_board : Board = JSON.parse(JSON.stringify(boards.get(socket.id)));
    boards.set(socket.id, this.gameService.reset(true, tmp_board));
    while (boards.has(socket.id) && !boards.get(socket.id).end)
    {
      await sleep(interval);
      if (boards.get(socket.id).new_game)
      {
        await sleep(1000);
        var tmp : Board = JSON.parse(JSON.stringify(boards.get(socket.id)));
        tmp.new_game = false;
        boards.set(socket.id, tmp);
      }
      var tmp_board : Board = JSON.parse(JSON.stringify(boards.get(socket.id)));
      boards.set(socket.id, this.gameService.updateBall(tmp_board));
      this.server.to(socket.id).emit('board', tmp_board);
      if (!(timer % 200))
      {
        tmp_board = JSON.parse(JSON.stringify(boards.get(socket.id)));
        tmp_board.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random()
          * boards.get(socket.id).player[1].half_height * 1.1 * boards.get(socket.id).ball.dx;
        boards.set(socket.id, tmp_board);
      }
      timer++;
    }
  }
}
