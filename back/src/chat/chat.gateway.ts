import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, BaseWsExceptionFilter } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { ChannelMember, ChannelMemberRole } from './entities/channel-member.entity';
import { ChannelVisibility } from './entities/channel.entity';
import { ChannelModerationType } from './entities/channel-moderation.entity';
import { User } from 'src/users/entities/user.entity';
import { getJwtFromSocket } from 'src/auth/jwt/jwt.service';
import { ClassSerializerInterceptor, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { WsJwt2faGuard } from 'src/auth/jwt/jwt.guard';
import * as PostgresError from '@fiveem/postgres-error-codes'

@UseGuards(WsJwt2faGuard)
@WebSocketGateway(3001, {namespace: "chat"})
@UseInterceptors(ClassSerializerInterceptor)
export class ChatGateway implements OnGatewayConnection{
    wsClients = new Map<number, any>();

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

    @SubscribeMessage('join')
    async join(@Req() req, @ConnectedSocket() client, @MessageBody() data: {channelId: number, password: string}) {
        let channel = await this.chatService.findChannel(data.channelId);
        if (channel.password && channel.password !== data.password)
            return client.emit("error", "wrong password")
        this.chatService.joinChannel(req.user, data.channelId, ChannelMemberRole.MEMBER);
        const history = await this.chatService.getChannelMessages(data.channelId, new Date(), 100);
        client.emit("joined", {channel: channel, history: history});
        // try {
        // if (!client.adapter.rooms.get(data.channelId).has(client.id)) {
        //     client.join(channel.id);
        //     this.handleMsg(client, {chanId: channel.id, msg: "HELLO"});
        // } }
        // catch {}
    }

    @SubscribeMessage('create')
    async createChannel(@Req() req, @ConnectedSocket() client : Socket, @MessageBody() data : {name: string, visibility: ChannelVisibility}) {
      try {
        const channel = await this.chatService.createChannel(data.name, req.user, data.visibility);
        this.chatService.joinChannel(req.user, channel.id, ChannelMemberRole.ADMIN);
        this.server.emit("created", { channel: channel})
        client.join("channel:" + channel.id);
      } catch (error) {
        if (error.code === PostgresError.PG_UNIQUE_VIOLATION)
          throw new WsException('channel already exists');
      }
    }

    @SubscribeMessage('message')
    async handleMsg(@Req() req, @ConnectedSocket() client, @MessageBody() data: {chanId: number, msg: string}) {
        const message = await this.chatService.createMessage(req.user, data.msg);
        const channelMessage = await this.chatService.createChannelMessage(data.chanId, message);
        console.log(channelMessage)
        this.server.in("channel:" + data.chanId).emit("message", { channelMessage: channelMessage });
    }

    @SubscribeMessage('leave')
    async leave(@Req() req, @ConnectedSocket() client, @MessageBody() channelId: number) {
        await this.chatService.leaveChannel(req.user, channelId);
        const members = await this.chatService.getChannelMembers(channelId);
        if (members.length == 0)
          this.chatService.deleteChannel(channelId);
        client.emit("left", { channelId: channelId });
    }

    @SubscribeMessage('chanModeration')
    async ban(@Req() req, @ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number, action: ChannelModerationType, duration: number, reason: string}) {
        const admin = await this.chatService.getChannelMember(data.chanId, req.user.id);
        if (admin.role !== ChannelMemberRole.ADMIN)
            throw new WsException('you\'re not an administrator')
        const members = await this.chatService.getChannelMembers(data.chanId);
        this.chatService.createChannelModeration(data.chanId, data.userId, req.user, data.action, data.reason, data.duration)
    }

    @SubscribeMessage('destroy')
    async destroy(@Req() req, @ConnectedSocket() client, @MessageBody() chanId: number) {
        const channel = await this.chatService.findChannel(chanId);
        if (req.user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        this.chatService.deleteChannel(chanId)
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

    @SubscribeMessage('invite')
    async invite(@Req() req, @ConnectedSocket() client, @MessageBody() data: {chanId: number, invitedId: number}) {
        const channel = await this.chatService.findChannel(data.chanId);
        this.chatService.createInvitation(data.chanId, req.user, data.invitedId)
        //this.wsClients.get(data.invitedId).send(JSON.stringify({event: "invited", data: {from: user, channel: channel}}))
    }

    @SubscribeMessage('join_with_invitation')
    async join_with_invitation(@Req() req, @ConnectedSocket() client, @MessageBody() chanId: number) {
        const channel = await this.chatService.findChannel(chanId);
        if (!(await this.chatService.isInvited(chanId, req.user)))
            throw new WsException('not invited to chan');
        const member = this.chatService.joinChannel(req.user, chanId, ChannelMemberRole.MEMBER);
        const history = await this.chatService.getChannelMessages(chanId, new Date(), 100);
        return JSON.stringify(history)
    }

    @SubscribeMessage('direct_message')
    async direct_message(@Req() req, @ConnectedSocket() client, @MessageBody() data: {towardId: number, content: string}) {
        const to = await this.usersService.findOne(data.towardId);
        const message = await this.chatService.createMessage(req.user, data.content)
        //this.wsClients.get(to.id).send(JSON.stringify(await this.chatService.createDirectMessage(to, message)));
    }
}
