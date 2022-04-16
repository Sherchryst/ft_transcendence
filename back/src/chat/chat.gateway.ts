import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, BaseWsExceptionFilter } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { ChannelMember, ChannelMemberRole } from './entities/channel-member.entity';
import { ChannelVisibility } from './entities/channel.entity';
import { ChannelModerationType } from './entities/channel-moderation.entity';
import { getJwtFromSocket } from 'src/auth/jwt/jwt.service';
import { ClassSerializerInterceptor, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { WsJwt2faGuard } from 'src/auth/jwt/jwt.guard';
import * as PostgresError from '@fiveem/postgres-error-codes';

@UseGuards(WsJwt2faGuard)
@WebSocketGateway(3001, {namespace: "chat"})
@UseInterceptors(ClassSerializerInterceptor)
export class ChatGateway implements OnGatewayConnection{
    wsClients = new Map<number, Socket>();

    @WebSocketServer()
    server

    constructor(private readonly chatService: ChatService,
        private readonly customJwtService: CustomJwtService,
        private readonly usersService: UsersService) {}

    async handleConnection(socket: Socket) {
        try {
            let jwt = getJwtFromSocket(socket)
            const payload = this.customJwtService.verify(jwt)
            const user = await this.usersService.findOne(payload.sub)
            if (user.twofa && !payload.isSecondFactorAuth)
                throw new WsException("")
            this.wsClients.set(user.id, socket);
            const channels = await this.usersService.getAllChannelsConnected(user.id)
            channels.forEach(channel => {
                socket.join('channel:' + channel.id)
            });
        }
        catch {
            console.log("Chat: Unauthorized connection")
            socket.disconnect(false)
            return
        }
        console.log("connected to chat...")
    }

    @SubscribeMessage('message')
    async handleMsg(@Req() req, @ConnectedSocket() client, @MessageBody() data: {chanId: number, msg: string}) {
        try {
        const message = await this.chatService.createMessage(req.user, data.msg);
        const channelMessage = await this.chatService.createChannelMessage(data.chanId, message);
        this.server.in("channel:" + data.chanId).emit("message", { channelMessage: channelMessage });
        } catch (error) {
            client.send("error", error)
        }
    }

    @SubscribeMessage('chanModeration')
    async ban(@Req() req, @ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number, action: ChannelModerationType, duration: number, reason: string}) {
        const admin = await this.chatService.getChannelMember(data.chanId, req.user.id);
        if (admin.role !== ChannelMemberRole.ADMIN)
            throw new WsException('you\'re not an administrator')
        const members = await this.chatService.getChannelMembers(data.chanId);
        this.chatService.createChannelModeration(data.chanId, data.userId, req.user, data.action, data.reason, data.duration)
    }

    @SubscribeMessage('change_owner')
    async change_owner(@Req() req, @ConnectedSocket() client, @MessageBody() data: {chanId: number, newOwnerId: number}) {
        const channel = await this.chatService.findChannel(data.chanId);
        if (req.user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        channel.owner = await this.usersService.findOne(data.newOwnerId);
        this.chatService.updateChannel(channel);
    }

    @SubscribeMessage('promote')
    async promote(@Req() req, @ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number}) {
        const channel = await this.chatService.findChannel(data.chanId);
        if (req.user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        const member = await this.chatService.getChannelMember(channel.id, req.user.id);
        member.role = ChannelMemberRole.ADMIN;
        this.chatService.updateMember(member);
    }

    @SubscribeMessage('demote')
    async demote(@Req() req, @ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number}) {
        const channel = await this.chatService.findChannel(data.chanId);
        if (req.user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        const member = await this.chatService.getChannelMember(channel.id, req.user.id);
        member.role = ChannelMemberRole.MEMBER;
        this.chatService.updateMember(member);
    }

    @SubscribeMessage('direct_message')
    async direct_message(@Req() req, @ConnectedSocket() client, @MessageBody() data: {towardId: number, content: string}) {
        console.log("direct message", data)
        try {
            const to = await this.usersService.findOne(data.towardId);
            const message = await this.chatService.createMessage(req.user, data.content)
            const direct_message = await this.chatService.createDirectMessage(to, message)
            this.wsClients.get(to.id).emit("direct_message", direct_message);
            client.emit("direct_message", direct_message)
        }
        catch (error) {
            client.emit("error", error);
        }
    }
}
