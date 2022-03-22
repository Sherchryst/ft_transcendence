import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { IncomingMessage, Server } from 'http';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MatchType } from './entities/match.entity';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { MatchService } from './match.service';

const interval = 20;
var   calc = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@WebSocketGateway(3001, {path: "/game"})
export class GameGateway implements OnGatewayConnection  {
  @WebSocketServer() private server: any;
  wsClients = new Map<number, any>();
  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }
  constructor(private readonly gameService : GameService,
    private readonly matchService : MatchService,
    private readonly customJwtService: CustomJwtService,
    private readonly usersService: UsersService) {}

  async handleConnection(client: any, msg: IncomingMessage) {
    try {
      const jwt = msg.headers.cookie.slice(4)
      const payload = this.customJwtService.verify(jwt)
      const user = await this.usersService.findOne(payload.sub)
      if (user.twofa && !payload.isSecondFactorAuth)
          throw new WsException("")
      client.jwt = jwt;
      this.wsClients.set(user.id, client);
      this.gameService.bot = (this.clients_count() < 2);
      if (this.clients_count() < 3)
      {
        this.broadcast("login" , {login : user.login, id : this.clients_count() - 1});
        console.log("New connection : ", this.clients_count() - 1, " : ", user.login);
      }
    }
    catch {
      client.close(1008, "Unauthorized")
      return
    }
  }

  async handleDisconnect(client: any) {
    const user = await this.auth(client);
    this.wsClients.delete(user.id)
    if (!this.clients_count())
      calc = false;
    this.gameService.bot = (this.clients_count() < 2)
    console.log("Disconnection");
  }

  @SubscribeMessage('connection')
  async handleMessage(
  @MessageBody() message: string,
  @ConnectedSocket() client: any) {
    const user = await this.auth(client);
    var map = await this.matchService.findMap(1);
    if (!map)
      map = await this.matchService.findMap(1);
    const data = JSON.stringify({event: "id" , data: { id: this.clients_count() - 1, map: map } });
    client.send(data);
    console.log("New connection : ", this.clients_count() - 1);
    console.log(data);
    if (!calc)
    {
      calc = true;
      var match = await this.matchService.createMatch(map, user, null, MatchType.CASUAL);
      this.sendUpdateBoard(this.clients_count());
    }
    return { event : 'board', data : this.gameService.updateBall() }
  }

  @SubscribeMessage('player')
  handlePlayer(@MessageBody() tmp: Player) {
    this.gameService.updatePlayer(tmp.id, tmp.y);
  }

  private broadcast(event, data) {
    this.wsClients.forEach((value, key) => value.send(JSON.stringify({ event : event, data : data})));
  }

  private async auth(client: any): Promise<User> {
    return this.usersService.findOne(this.customJwtService.verify(client.jwt).sub)
  }

  private clients_count() : number
  {
    var count_clients = 0;
    this.wsClients.forEach(() => count_clients++);
    console.log(count_clients);
    return(count_clients);
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
        this.gameService.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random()
                                    * this.gameService.board.player[1].half_height * 1.1 * this.gameService.board.ball.dx;
      timer++;
    }
  }
}
