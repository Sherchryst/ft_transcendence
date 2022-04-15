import {
    ConnectedSocket,
    OnGatewayConnection,
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
      this.usersService.WsClients.set(user.id, socket);
      this.usersService.sendOwnStatus(user.id, "online", "");
      this.usersService.sendFriendsStatus(socket, user.id);
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
          await this.usersService.sendOwnStatus(key, "offline", "");
          this.usersService.WsClients.delete(key);
        }
      });
      console.log("Status : disconnection from socket");
    } catch (e) {
      console.log("Status : Error while disconnecting");
    }
  }
}
