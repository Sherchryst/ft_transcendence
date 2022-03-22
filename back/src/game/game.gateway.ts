import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3001)
export class GameGateway implements OnGatewayConnection{
  @WebSocketServer()
  server : Server;
  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }
  handleConnection(client) {
    console.log("connection to socket... token = ", client.handshake.query.token)
  }
  handleDisconnection(client) {
    console.log("disconnection", client.handshake.query.token)
  }
}