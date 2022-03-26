import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
// import { IncomingMessage } from 'http';
// import { CustomJwtService } from 'src/auth/jwt/jwt.service';
// import { User } from 'src/users/entities/user.entity';
// import { UsersService } from 'src/users/users.service';
// import { MatchType } from './entities/match.entity';
// import { MatchService } from './match.service';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { Board } from './interfaces/board.interface';
import { MatchService } from './match.service';
// import { SocketAddress } from 'net';

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
    // private readonly customJwtService: CustomJwtService,
    // private readonly usersService: UsersService

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
    console.log("disconnection from game : ", id);
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
  async handleMessage(
    @MessageBody() id: string,
    @ConnectedSocket() socket: Socket) {
      boards.set(socket.id, basic_board);
      var map = await this.matchService.findMap(1);
      this.server.to(socket.id).emit("id" , { id: 0, map: map });
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
    // console.log("Update Board", boards);
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
      {
        tmp_board = JSON.parse(JSON.stringify(boards.get(socket.id)));
        tmp_board.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random()
          * boards.get(socket.id).player[1].half_height * 1.1 * boards.get(socket.id).ball.dx;
        boards.set(socket.id, tmp_board);
      }
        // this.gameService.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random()
        //                             * this.gameService.board.player[1].half_height * 1.1 * this.gameService.board.ball.dx;
      timer++;
    }
  }
}

//   wsClients = new Map<number, any>();
//   async handleConnection(client: any, msg: IncomingMessage) {
//     try {
//       const jwt = msg.headers.cookie.slice(4)
//       const payload = this.customJwtService.verify(jwt)
//       const user = await this.usersService.findOne(payload.sub)
//       if (user.twofa && !payload.isSecondFactorAuth)
//           throw new WsException("")
//       client.jwt = jwt;
//       this.wsClients.set(user.id, client);
//       this.gameService.bot = (this.clients_count() < 2);
//       if (this.clients_count() < 3)
//       {
//         this.broadcast("login" , {login : user.login, id : this.clients_count() - 1});
//         console.log("New connection : ", this.clients_count() - 1, " : ", user.login);
//       }
//     }
//     catch {
//       client.close(1008, "Unauthorized")
//       return
//     }
//   }

//   async handleDisconnect(client: any) {
//     const user = await this.auth(client);
//     this.wsClients.delete(user.id)
//     if (!this.clients_count())
//       calc = false;
//     this.gameService.bot = (this.clients_count() < 2)
//     console.log("Disconnection");
//   }

//   @SubscribeMessage('connection')
//   async handleMessage(
//   @MessageBody() message: string,
//   @ConnectedSocket() client: any) {
//     const user = await this.auth(client);
//     var map = await this.matchService.findMap(1);
//     if (!map)
//       map = await this.matchService.findMap(1);
//     const data = JSON.stringify({event: "id" , data: { id: this.clients_count() - 1, map: map } });
//     client.send(data);
//     console.log("New connection : ", this.clients_count() - 1);
//     console.log(data);
//     if (!calc)
//     {
//       calc = true;
//       var match = await this.matchService.createMatch(map, user, null, MatchType.CASUAL);
//       this.sendUpdateBoard(this.clients_count());
//     }
//     return { event : 'board', data : this.gameService.updateBall() }
//   }


//   private async auth(client: any): Promise<User> {
//     return this.usersService.findOne(this.customJwtService.verify(client.jwt).sub)
//   }
