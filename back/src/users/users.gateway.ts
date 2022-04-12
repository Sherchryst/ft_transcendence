import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
  } from "@nestjs/websockets";
  import { Server, Socket } from "socket.io";
  import { CustomJwtService, getJwtFromSocket } from "src/auth/jwt/jwt.service";
  import { UsersService } from "src/users/users.service";
  import { WsJwt2faGuard } from "src/auth/jwt/jwt.guard";
  import { Req, UseGuards } from "@nestjs/common";
  
@UseGuards(WsJwt2faGuard)
@WebSocketGateway(3001, { namespace: "status" })
export class StatusGateway implements OnGatewayConnection {
  static startStatus() {
    throw new Error("Status : Method not implemented.");
  }

  @WebSocketServer()
  server: Server;
  constructor(
    private readonly customJwtService: CustomJwtService,
    private readonly usersService: UsersService
  ) {}

  afterInit() {
    this.server.emit("testing", { do: "stuff" });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const jwt = getJwtFromSocket(socket);
      const payload = this.customJwtService.verify(jwt);
      const user = await this.usersService.findOne(payload.sub);
      if (user.twofa && !payload.isSecondFactorAuth) throw new WsException("");
      // console.log("allo", user.id, socket.id, this.WsClients)
      this.usersService.WsClients.set(user.id, socket);
      this.sendStatus(user.id, "online", "");
      //get friends online TODO ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } catch (reason) {
      // console.log("Status: Unauthorized connection", reason);
      socket.disconnect(false);
      return;
    }
    console.log("Status : New connection to socket");
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    // --> put score of other player to 11 in bd
    // this.WsClients.delete(req.user?.id);
    try {
      let player_id: number;
      this.usersService.WsClients.forEach(async (value, key) => {
        if (value == socket) {
          await this.sendStatus(key, "offline", "");
          this.usersService.WsClients.delete(key);
        }
      });
      console.log("Status : disconnection from socket");
    } catch (e) {
      console.log("Status : Error while disconnecting");
    }
  }

  async sendStatus(userId: number, status : string, message : string) {
    const friends = await this.usersService.getFriends(userId);
    friends.forEach((friend) => {
      if (this.usersService.WsClients.has(friend.id))
        this.usersService.WsClients.get(friend.id).emit("status", { userId : userId, status : status, message : message });
    });
  }
}
// @WebSocketGateway(3002, {path: "/status"})
// export class UsersGateway implements OnGatewayConnection {
//     wsClients = new Map<number, any>();

//     constructor(
//         private readonly customJwtService: CustomJwtService,
//         private readonly usersService: UsersService) {}

//     async handleConnection(client: any, msg: IncomingMessage) {
//         try {
//             const jwt = msg.headers.cookie.slice(4)
//             const payload = this.customJwtService.verify(jwt)
//             const user = await this.usersService.findOne(payload.sub)
//             if (user.twofa && !payload.isSecondFactorAuth)
//                 throw new WsException("")
//             client.jwt = jwt;
//             this.wsClients.set(user.id, client);
//         }
//         catch {
//             client.close(1008, "Unauthorized")
//             return
//         }
//     }

//     private async auth(client: any): Promise<User> {
//         return this.usersService.findOne(this.customJwtService.verify(client.jwt).sub)
//     }

//     async handleDisconnect(client: any) {
//         const user = await this.auth(client);
//         this.wsClients.delete(user.id)
//     }

//     @SubscribeMessage('update')
//     async update(@ConnectedSocket() client, @MessageBody() status: string) {
//         await this.auth(client);
//         this.wsClients.forEach((user) => {
//             if (client !== user)
//                 user.send(JSON.stringify({ event: 'update', data: status}));
//         })
//     }

//     @SubscribeMessage('request')
//     async request(@ConnectedSocket() client, @MessageBody() targetId: number) {
//         const user = await this.auth(client);
//         this.wsClients.get(targetId).send(JSON.stringify({event: 'request', data: user.id}))

//     }

//     @SubscribeMessage('send')
//     async send(@ConnectedSocket() client, @MessageBody() data: {targetId: number, status: string}) {
//         await this.auth(client);
//         this.wsClients.get(data.targetId).send(JSON.stringify({event: 'send', data: {from: data.targetId, status: data.status}}))
//     }
// }
