import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelMember } from './chat/entities/channel-member.entity';

var connectCounter = 0;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@WebSocketGateway(3001)
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  server : Server;
  // constructor(private readonly appService : AppService){}

  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }
  handleConnection(server : any) {
    // var userId = 
    // var channels : ChannelMember[] = listUserChannels(userId)
    connectCounter++;
    console.log("connection to socket...");
  }
  handleDisconnect(server : any) {
    connectCounter--;
    console.log("disconnection");
  }
}
