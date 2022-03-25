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


@WebSocketGateway(3001, {namespace: "chat"})
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer()
    server : Server;
    wsClients = new Map<number, string>();
    
    constructor(private readonly chatService: ChatService,
        private readonly customJwtService: CustomJwtService,
        private readonly usersService: UsersService) {}

    private async auth(client: any): Promise<User> {
        let user;
        try {
            user = await this.usersService.findOne(this.customJwtService.verify(client.jwt).sub);
        }
        catch(error) {
            client.disconnect();
        }
        if (!user)
            client.disconnect();
        return user;
    }

    async handleConnection(client: any) {
        console.log("connection to chat...");
        try {
        client.request.headers.cookie.split(';').forEach((field: string) => {
            if (field.includes('jwt='))
                client.jwt = field.slice(4);
        });
        const user = await this.auth(client);
        this.wsClients[user.id] = client.id;
        }
        catch {
            client.disconnect();
        }
    }

    @SubscribeMessage('join')
    async join(@ConnectedSocket() client, @MessageBody() data: {channelId: number, password: string}) {
        const user = await this.auth(client)
        let channel = await this.chatService.findChannel(data.channelId);
        if (channel.password && channel.password !== data.password)
            return client.emit("error", "wrong password")
        this.chatService.joinChannel(user, data.channelId, ChannelMemberRole.MEMBER);
        const history = await this.chatService.getChannelMessages(data.channelId, new Date(), 100);
        client.emit("joined", {channel: channel, history: history});
        try {
        if (!client.adapter.rooms.get(data.channelId).has(client.id)) {
            client.join(channel.id);
            this.handleMsg(client, {chanId: channel.id, msg: "HELLO"});
        } }
        catch {}
    }

    @SubscribeMessage('create')
    async createChannel(@ConnectedSocket() client: Socket, @MessageBody() data: {name: string, visibility: ChannelVisibility}) {
        const user = await this.auth(client)
        const channel = await this.chatService.createChannel(data.name, user, data.visibility);
        this.chatService.joinChannel(user, channel.id, ChannelMemberRole.ADMIN);
        client.emit("created", channel);
        client.join(String(channel.id));
    }

    @SubscribeMessage('message')
    async handleMsg(@ConnectedSocket() client, @MessageBody() data: {chanId: number, msg: string}) {
        const user = await this.auth(client)
        const message = await this.chatService.createMessage(user, data.msg);
        const channelMessage = await this.chatService.createChannelMessage(data.chanId, message);
        console.log(channelMessage)
        client.in(String(data.chanId)).emit("message", channelMessage);
    }

    @SubscribeMessage('leave')
    async leave(@ConnectedSocket() client, @MessageBody() channelId: number) {
        const user = await this.auth(client)
        await this.chatService.leaveChannel(user, channelId);
        const members = await this.chatService.getChannelMembers(channelId);
        if (members.length == 0)
          this.chatService.deleteChannel(channelId);
        client.emit("left", { channelId: channelId });
    }

    @SubscribeMessage('chanModeration')
    async ban(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number, action: ChannelModerationType, duration: number, reason: string}) {
        const user = await this.auth(client)
        const admin = await this.chatService.getChannelMember(data.chanId, user.id);
        if (admin.role !== ChannelMemberRole.ADMIN)
            throw new WsException('you\'re not an administrator')
        const members = await this.chatService.getChannelMembers(data.chanId);
        this.chatService.createChannelModeration(data.chanId, data.userId, user, data.action, data.reason, data.duration)
    }

    @SubscribeMessage('destroy')
    async destroy(@ConnectedSocket() client, @MessageBody() chanId: number) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(chanId);
        if (user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        this.chatService.deleteChannel(chanId)
    }

    @SubscribeMessage('change_owner')
    async change_owner(@ConnectedSocket() client, @MessageBody() data: {chanId: number, newOwnerId: number}) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        channel.owner = await this.usersService.findOne(data.newOwnerId);
        this.chatService.updateChannel(channel);
    }

    @SubscribeMessage('promote')
    async promote(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number}) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        const member = await this.chatService.getChannelMember(channel.id, user.id);
        member.role = ChannelMemberRole.ADMIN;
        this.chatService.updateMember(member);
    }

    @SubscribeMessage('demote')
    async demote(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number}) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new WsException('you\'re not the owner');
        const member = await this.chatService.getChannelMember(channel.id, user.id);
        member.role = ChannelMemberRole.MEMBER;
        this.chatService.updateMember(member);
    }

    @SubscribeMessage('invite')
    async invite(@ConnectedSocket() client, @MessageBody() data: {chanId: number, invitedId: number}) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(data.chanId);
        this.chatService.createInvitation(data.chanId, user, data.invitedId)
        //this.wsClients.get(data.invitedId).send(JSON.stringify({event: "invited", data: {from: user, channel: channel}}))
    }

    @SubscribeMessage('join_with_invitation')
    async join_with_invitation(@ConnectedSocket() client, @MessageBody() chanId: number) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(chanId);
        if (!(await this.chatService.isInvited(chanId, user)))
            throw new WsException('not invited to chan');
        const member = this.chatService.joinChannel(user, chanId, ChannelMemberRole.MEMBER);
        const history = await this.chatService.getChannelMessages(chanId, new Date(), 100);
        return JSON.stringify(history)
    }

    @SubscribeMessage('direct_message')
    async direct_message(@ConnectedSocket() client, @MessageBody() data: {towardId: number, content: string}) {
        const user = await this.auth(client);
        const to = await this.usersService.findOne(data.towardId);
        const message = await this.chatService.createMessage(user, data.content)
        //this.wsClients.get(to.id).send(JSON.stringify(await this.chatService.createDirectMessage(to, message)));
    }
}

