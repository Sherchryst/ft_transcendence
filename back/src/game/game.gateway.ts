import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';

const interval = 20;
var   calc = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@WebSocketGateway(3001, {path: "/game"})
//   , { cors: { origin: "http://localhost:*", methods: ["GET", "POST"] }, handlePreflightRequest: (req, res) => { //WARNING : change * with address
//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//   };
//   res.writeHead(200, headers);
//   res.end();
//   console.log("Trololo");
// } } )
export class GameGateway implements OnGatewayConnection  {
  @WebSocketServer() private server: any;
  wsClients=[];
  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }
  // server: Server;
  constructor(private readonly gameService : GameService)
	{
    // console.log("Construct Gateway", this.server);
  }

  handleConnection(client: any) {
    // console.log("New socket connection ", arg);
    this.wsClients.push(client);
    this.gameService.bot = (this.wsClients.length < 2)
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
    if (!this.wsClients.length)
      calc = false;
    this.gameService.bot = (this.wsClients.length < 2)
    console.log("disconnection");
  }

  @SubscribeMessage('connection')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: any) {
      // console.log("Has connection", client);
      // console.log(message);
      // this.gameService.reset();
      // client.emit('gameParams', this.gameService.findBoard(), (data) => console.log("DATA SENT : ", data));
      // console.log("LENGTH = ", this.wsClients.length);
      client.send(JSON.stringify({event: "id" , data: this.wsClients.length - 1}));
      if (!calc)
      {
        calc = true;
        this.sendUpdateBoard(this.wsClients.length);
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

  private broadcast(event, data) {
    for (let c of this.wsClients) {
      c.send(JSON.stringify({ event : event, data : data}));
    }
  }

  async sendUpdateBoard(players : number) {
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
      this.broadcast('board', this.gameService.updateBall());
      if (!(timer % 200))
        this.gameService.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random() * this.gameService.board.player[1].half_height;
      timer++;
    }
  }
}
