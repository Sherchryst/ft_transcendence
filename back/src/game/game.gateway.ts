import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { Board } from './interfaces/board.interface';
import { SocketAddress } from 'net';

const interval = 20;
var calc = false;
const speed = 1;
var boards = new Map<string, Board>();
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
  bot : true,
  bot_speed : 3,
  bot_offset : 0,
	end : false,
  pass_count : 0,
  new_game : true
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@WebSocketGateway(3001, { namespace : "game" })
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server : Server;
  constructor(private readonly gameService : GameService){}

  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }

  handleConnection(@ConnectedSocket() socket : Socket) {
      // socket.join(id.toString());
      console.log("connection to game... id :", socket.id);
    // boards[connectCounter].bot = (connectCounter < 2);
  }

  handleDisconnect(@ConnectedSocket() socket : Socket) {
    const id : string = socket.id;
    var ret_delete = boards.delete(id);
    console.log("disconnection from game : ", id, " Board :", boards, "DELETE : ", ret_delete);
    // for (let i = 0; i < connectCounter; i++) {
    //   if (this.wsClients[i] === client) {
    //     this.wsClients.splice(i, 1);
    //     break;
    //   }
    // }
    // if (!connectCounter)
    //   calc = false;
      // boards[connectCounter].bot = (connectCounter < 2)
  }

  @SubscribeMessage('connection')
  handleMessage(
    @MessageBody() id: string,
    @ConnectedSocket() socket: Socket) {
      boards.set(socket.id, basic_board);
      this.server.to(socket.id).emit("id" , 0);
      // console.log("Has connection", client);
      console.log("back from connection", socket.id);
      // this.gameService.reset();
      // client.emit('gameParams', this.gameService.findBoard(), (data) => console.log("DATA SENT : ", data));
      // console.log("LENGTH = ", connectCounter);
      // calc = false
      // if (!calc)
      // {
      //   calc = true;
      this.sendUpdateBoard(socket);
      // }
      // return { event : 'board', data : "coucou" }
      // this.server.emit(JSON.stringify({event : 'gameParams', data : this.gameService.findBoard()}));
  }

  @SubscribeMessage('player')
  handlePlayer(
    @MessageBody() tmp: Player,
    @ConnectedSocket() socket: Socket) {
      // var tmp : Player = JSON.parse(message)
      // console.log("player id :", socket.id);
      if (!boards.has(socket.id))
        return ;
      var tmp_board : Board = JSON.parse(JSON.stringify(boards.get(socket.id)));
      boards.set(socket.id, this.gameService.updatePlayer(0, tmp.y, tmp_board));
  }
  async sendUpdateBoard(socket: Socket) {
    var timer = 0;
    // if (!boards.get(socket.id))
    //   return ;
    console.log("Update Board", boards);
    if (!boards.has(socket.id))
        return ;
    var tmp_board : Board = JSON.parse(JSON.stringify(boards.get(socket.id)));
    boards.set(socket.id, this.gameService.reset(true, tmp_board));
    while (boards.has(socket.id) && !boards.get(socket.id).end) // & calc
    {
      // console.log("coucou");
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
      boards.get(socket.id).bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random() * boards.get(socket.id).player[1].half_height;
      timer++;
    }
  }
}
