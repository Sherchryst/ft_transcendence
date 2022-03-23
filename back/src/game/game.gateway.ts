import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';

const interval = 20;
var connectCounter = 0;
var   calc = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@WebSocketGateway(3001)
export class GameGateway implements OnGatewayConnection{
  @WebSocketServer()
  server : Server;
  constructor(private readonly gameService : GameService){}

  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }
  handleConnection(server) {
    connectCounter++;
    console.log("connection to socket... token = ", server.handshake.query.token, "coucou", connectCounter)
    this.gameService.bot = (connectCounter < 2)
  }
  handleDisconnect(server) {
    connectCounter--;
    console.log("disconnection", server.handshake.query.token)
    // for (let i = 0; i < connectCounter; i++) {
    //   if (this.wsClients[i] === client) {
    //     this.wsClients.splice(i, 1);
    //     break;
    //   }
    // }
    if (!connectCounter)
      calc = false;
    this.gameService.bot = (connectCounter < 2)
  }

  @SubscribeMessage('connection')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket) {
      // console.log("Has connection", client);
      // console.log(message);
      // this.gameService.reset();
      // client.emit('gameParams', this.gameService.findBoard(), (data) => console.log("DATA SENT : ", data));
      // console.log("LENGTH = ", connectCounter);
      console.log("HEEEEEEEEEEEEEERRRRRRRRRRRRRRRREEEEEEEEEEEEEEEE", connectCounter)
      socket.emit("id" , connectCounter - 1);
      calc = false
      if (!calc)
      {
        calc = true;
        this.sendUpdateBoard(socket, connectCounter);
      }
      return { event : 'board', data : this.gameService.updateBall() }
      // this.server.emit(JSON.stringify({event : 'gameParams', data : this.gameService.findBoard()}));
  }

  @SubscribeMessage('player')
  handlePlayer(
    @MessageBody() tmp: Player) {
      // console.log("PLAYER :", tmp.id, " MOVES TO ", tmp.y);
      // var tmp : Player = JSON.parse(message)
      this.gameService.updatePlayer(tmp.id, tmp.y);
  }
  async sendUpdateBoard(@ConnectedSocket() socket: Socket, players : number) {
    var timer = 0;
    this.gameService.reset(true);
    while (calc && !this.gameService.board.end)
    {
      await sleep(interval);
      if (this.gameService.new_game)
      {
        await sleep(1000);
        this.gameService.new_game = false;
      }
      socket.broadcast.emit('board', this.gameService.updateBall());
      if (!(timer % 200))
        this.gameService.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random() * this.gameService.board.player[1].half_height;
      timer++;
    }
}

// @WebSocketGateway(3001, {path: "/game"})
// //   , { cors: { origin: "http://localhost:*", methods: ["GET", "POST"] }, handlePreflightRequest: (req, res) => { //WARNING : change * with address
// //   const headers = {
// //     'Access-Control-Allow-Origin': '*',
// //   };
// //   res.writeHead(200, headers);
// //   res.end();
// //   console.log("Trololo");
// // } } )
// export class GameGateway implements OnGatewayConnection  {
//   @WebSocketServer() private server: any;
//   wsClients=[];
// @WebSocketGateway(3001)
// export class GameGateway implements OnGatewayConnection{
//   @WebSocketServer()
//   server : Server;
//   afterInit() {
//     this.server.emit('testing', { do: 'stuff' });
//   }
//   // server: Server;
}
