import { Res, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException} from '@nestjs/websockets';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { IncomingMessage } from 'http';
import { UsersService } from 'src/users/users.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { ChannelMemberRole } from './entities/channel-member.entity';

@WebSocketGateway(3001)
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer() private server: any;
    wsClients = new Map<string, User>();
    
    constructor(private readonly chatService: ChatService,
        private readonly customJwtService: CustomJwtService,
        private readonly usersService: UsersService) {}
        
        async handleConnection(client: any, msg: IncomingMessage) {
        try {
            const payload = this.customJwtService.verify(msg.headers.cookie.slice(4))
            const user = await this.usersService.findOne(payload.sub)
            if (user.twofa && !payload.isSecondFactorAuth)
                throw new WsException("")
            client.id = user.id
            this.wsClients[payload.sub] = user
        }
        catch {
            client.close(1008, "Unauthorized")
            return
        }
    }

    handleDisconnect(client: WebSocket) {
    }

    @SubscribeMessage('join')
    async join(@ConnectedSocket() client, @MessageBody() data: { channelId: number }) {
        const user = await this.usersService.findOne(client.id);
        return await this.chatService.joinChannel(user, data.channelId, ChannelMemberRole.MEMBER);
    }

    @SubscribeMessage('create')
    async createChannel(@ConnectedSocket() client, @MessageBody() data: { name: string }) {
        const user = await this.usersService.findOne(client.id);
        const channel = await this.chatService.createChannel(data.name, user);
        this.chatService.joinChannel(user, channel.id, ChannelMemberRole.ADMIN);
        return channel;
    }

    @SubscribeMessage('msg')
    async handleMsg() {
        return "hello today we will be learning about websockets";
    }
}
