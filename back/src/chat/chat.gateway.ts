import { Res, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException} from '@nestjs/websockets';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { IncomingMessage } from 'http';
import { UsersService } from 'src/users/users.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { ChannelMember, ChannelMemberRole } from './entities/channel-member.entity';
import { ChannelVisibility } from './entities/channel.entity';

@WebSocketGateway(3001)
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer() private server: any;
    wsClients = new Map<number, any>();
    
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
            this.wsClients.set(user.id, client)
            console.log(this.wsClients.has(user.id))
        }
        catch {
            client.close(1008, "Unauthorized")
            return
        }
    }

    private async broadcast(fromId: number, channelId: number, event: string, members: ChannelMember[], data: any) {
        for (const member of members) {
          if (fromId != member.user.id && !await this.chatService.isBanned(member.user, channelId) && await this.wsClients.has(member.user.id)) {
            console.log(member.user.id)
            this.wsClients.get(member.user.id).send(JSON.stringify({ event: event, data: data }));
          }
        }
    }

    async handleDisconnect(client: any) {
        const user = await this.usersService.findOne(client.id);
        this.wsClients.delete(user.id)
    }

    @SubscribeMessage('join')
    async join(@ConnectedSocket() client, @MessageBody() channelId: number) {
        const user = await this.usersService.findOne(client.id);
        let channel = await this.chatService.findChannel(channelId);
        await this.chatService.joinChannel(user, channelId, ChannelMemberRole.MEMBER);
        const history = await this.chatService.getChannelMessages(channelId);
        return { event: "joined", data: { channel: channel, history: history} };
    }

    @SubscribeMessage('create')
    async createChannel(@ConnectedSocket() client, @MessageBody() data: {name: string, visibility: ChannelVisibility}) {
        const user = await this.usersService.findOne(client.id);
        const channel = await this.chatService.createChannel(data.name, user, data.visibility);
        this.chatService.joinChannel(user, channel.id, ChannelMemberRole.ADMIN);
        return { event: "created", data: { channel: channel } };
    }

    @SubscribeMessage('message')
    async handleMsg(@ConnectedSocket() client, @MessageBody() data: {chanId: number, msg: string}) {
        const user = await this.usersService.findOne(client.id);
        const message = await this.chatService.createMessage(user, data.msg);
        const channelMessage = await this.chatService.createChannelMessage(data.chanId, message);
        const members = await this.chatService.getChannelMembers(data.chanId);
        console.log(members)
        this.broadcast(user.id, data.chanId, "message", members, { channelMessage: channelMessage });
    }

    @SubscribeMessage('leave')
    async leave(@ConnectedSocket() client, @MessageBody() channelId: number) {
        const user = await this.usersService.findOne(client.id);
        await this.chatService.leaveChannel(user, channelId);
        const members = await this.chatService.getChannelMembers(channelId);
        if (members.length == 0)
          await this.chatService.deleteChannel(channelId);
        else
          this.broadcast(user.id, channelId, "left", members, { channelId: channelId });
        return { event: "left", data: { channelId: channelId } };
    }
}
