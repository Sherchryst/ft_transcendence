import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { IncomingMessage } from 'http';
import { UsersService } from 'src/users/users.service';
import { ChannelMember, ChannelMemberRole } from './entities/channel-member.entity';
import { ChannelVisibility } from './entities/channel.entity';
import { ChannelModerationType } from './entities/channel-moderation.entity';
import { User } from 'src/users/entities/user.entity';
import { callbackify } from 'util';

import { Catch, ArgumentsHost } from '@nestjs/common';
import { stringify } from 'querystring';
import { channel } from 'diagnostics_channel';
import { SocketAddress } from 'net';
@WebSocketGateway(3001, {namespace: "chat"})
export class ChatGateway implements OnGatewayConnection{
    wsClients = new Map<number, any>();

    @WebSocketServer()
    server
    
    constructor(private readonly chatService: ChatService,
        private readonly customJwtService: CustomJwtService,
        private readonly usersService: UsersService) {}
    
    async handleConnection(socket: Socket) {
        try {
            let jwt = this.getJwtFromSocket(socket)
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
    }

    private async broadcast(fromId: number, channelId: number, event: string, members: ChannelMember[], data: any) {
        for (const member of members) {
          if (fromId != member.user.id && !await this.chatService.isBanned(member.user, channelId) && await this.wsClients.has(member.user.id)) {
            this.wsClients.get(member.user.id).send(JSON.stringify({ event: event, data: data }));
          }
        }
    }

    getJwtFromSocket(socket: Socket): string {
        let jwt
        const cookies = socket.handshake?.headers?.cookie.split(';').map(v => v.split('='));
        cookies.forEach((v) => {
            if (v[0].trim() === "jwt") {
                jwt = v[1].trim();
            }
        })
        return jwt

        // socket.request.headers.cookie.split(';').forEach((field: string) => {
        //     if (field.includes('jwt='))
        //         socket.jwt = field.slice(4);
        // });

        // return jwt
    }

    async getUser(client: Socket): Promise<User>{
        let user 
        try {
            user = await this.usersService.findOne(
                this.customJwtService.verify(this.getJwtFromSocket(client)).sub
            );
        }
        catch {
            client.disconnect(false)
        }
        if (!user)
            client.disconnect(false)
        return user
    }

    async handleDisconnect(client: Socket) {
        const user = await this.getUser(client);
        // if (user)
        //     this.wsClients.delete(user.id)
    }

    @SubscribeMessage('join')
    async join(@ConnectedSocket() client, @MessageBody() data: {channelId: number, password: string}) {
        const user = await this.getUser(client)
        let channel = await this.chatService.findChannel(data.channelId);
        if (channel.password && channel.password !== data.password)
            return client.emit("error", "wrong password")
        this.chatService.joinChannel(user, data.channelId, ChannelMemberRole.MEMBER);
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
    async createChannel(@ConnectedSocket() client : Socket, @MessageBody() data : {name: string, visibility: ChannelVisibility}) {
        const user = await this.getUser(client)
        const channel = await this.chatService.createChannel(data.name, user, data.visibility);
        this.chatService.joinChannel(user, channel.id, ChannelMemberRole.ADMIN);
        this.server.emit("created", { channel: channel})
        client.join("channel:" + channel.id);
    }

    @SubscribeMessage('message')
    async handleMsg(@ConnectedSocket() client, @MessageBody() data: {chanId: number, msg: string}) {
        const user = await this.getUser(client)
        const message = await this.chatService.createMessage(user, data.msg);
        const channelMessage = await this.chatService.createChannelMessage(data.chanId, message);
        console.log(channelMessage)
        this.server.in("channel:" + data.chanId).emit("message", { channelMessage: channelMessage });
    }

    @SubscribeMessage('leave')
    async leave(@ConnectedSocket() client, @MessageBody() channelId: number) {
        const user = await this.getUser(client)
        await this.chatService.leaveChannel(user, channelId);
        const members = await this.chatService.getChannelMembers(channelId);
        if (members.length == 0)
          this.chatService.deleteChannel(channelId);
        client.emit("left", { channelId: channelId });
    }

    @SubscribeMessage('chanModeration')
    async ban(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number, action: ChannelModerationType, duration: number, reason: string}) {
        const user = await this.getUser(client)
        const admin = await this.chatService.getChannelMember(data.chanId, user.id);
        if (admin.role !== ChannelMemberRole.ADMIN)
            throw new WsException('you\'re not an administrator')
        const members = await this.chatService.getChannelMembers(data.chanId);
        this.chatService.createChannelModeration(data.chanId, data.userId, user, data.action, data.reason, data.duration)
    }

    @SubscribeMessage('destroy')
    async destroy(@ConnectedSocket() client, @MessageBody() chanId: number) {
        const user = await this.getUser(client)
        const channel = await this.chatService.findChannel(chanId);
        if (user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        this.chatService.deleteChannel(chanId)
    }

    @SubscribeMessage('change_owner')
    async change_owner(@ConnectedSocket() client, @MessageBody() data: {chanId: number, newOwnerId: number}) {
        const user = await this.getUser(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        channel.owner = await this.usersService.findOne(data.newOwnerId);
        this.chatService.updateChannel(channel);
    }

    @SubscribeMessage('promote')
    async promote(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number}) {
        const user = await this.getUser(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        const member = await this.chatService.getChannelMember(channel.id, user.id);
        member.role = ChannelMemberRole.ADMIN;
        this.chatService.updateMember(member);
    }

    @SubscribeMessage('demote')
    async demote(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number}) {
        const user = await this.getUser(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        const member = await this.chatService.getChannelMember(channel.id, user.id);
        member.role = ChannelMemberRole.MEMBER;
        this.chatService.updateMember(member);
    }

    @SubscribeMessage('invite')
    async invite(@ConnectedSocket() client, @MessageBody() data: {chanId: number, invitedId: number}) {
        const user = await this.getUser(client)
        const channel = await this.chatService.findChannel(data.chanId);
        this.chatService.createInvitation(data.chanId, user, data.invitedId)
        //this.wsClients.get(data.invitedId).send(JSON.stringify({event: "invited", data: {from: user, channel: channel}}))
    }

    @SubscribeMessage('join_with_invitation')
    async join_with_invitation(@ConnectedSocket() client, @MessageBody() chanId: number) {
        const user = await this.getUser(client)
        const channel = await this.chatService.findChannel(chanId);
        if (!(await this.chatService.isInvited(chanId, user)))
            throw new WsException('not invited to chan');
        const member = this.chatService.joinChannel(user, chanId, ChannelMemberRole.MEMBER);
        const history = await this.chatService.getChannelMessages(chanId, new Date(), 100);
        return JSON.stringify(history)
    }

    @SubscribeMessage('direct_message')
    async direct_message(@ConnectedSocket() client, @MessageBody() data: {towardId: number, content: string}) {
        const user = await this.getUser(client);
        const to = await this.usersService.findOne(data.towardId);
        const message = await this.chatService.createMessage(user, data.content)
        //this.wsClients.get(to.id).send(JSON.stringify(await this.chatService.createDirectMessage(to, message)));
    }
}

