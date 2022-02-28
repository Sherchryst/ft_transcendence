import { UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { IncomingMessage } from 'http';
import { UsersService } from 'src/users/users.service';
import { ChannelMember, ChannelMemberRole } from './entities/channel-member.entity';
import { ChannelVisibility } from './entities/channel.entity';
import { ChannelModerationType } from './entities/channel-moderation.entity';
import { User } from 'src/users/entities/user.entity';

@WebSocketGateway(3001)
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer() private server: any;
    wsClients = new Map<number, any>();
    
    constructor(private readonly chatService: ChatService,
        private readonly customJwtService: CustomJwtService,
        private readonly usersService: UsersService) {}
        
    async handleConnection(client: any, msg: IncomingMessage) {
        try {
            const jwt = msg.headers.cookie.slice(4)
            const payload = this.customJwtService.verify(jwt)
            const user = await this.usersService.findOne(payload.sub)
            if (user.twofa && !payload.isSecondFactorAuth)
                throw new WsException("")
            client.jwt = jwt;
            this.wsClients.set(user.id, client);
        }
        catch {
            client.close(1008, "Unauthorized")
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

    private async auth(client: any): Promise<User> {
        return this.usersService.findOne(this.customJwtService.verify(client.jwt).sub)
    }

    async handleDisconnect(client: any) {
        const user = await this.auth(client);
        this.wsClients.delete(user.id)
    }

    @SubscribeMessage('join')
    async join(@ConnectedSocket() client, @MessageBody() data: {channelId: number, password: string}) {
        const user = await this.auth(client)
        let channel = await this.chatService.findChannel(data.channelId);
        if (channel.password !== data.password)
            throw new UnauthorizedException("wrong password");
        this.chatService.joinChannel(user, data.channelId, ChannelMemberRole.MEMBER);
        const history = await this.chatService.getChannelMessages(data.channelId, new Date(), 100);
        return { event: "joined", data: { channel: channel, history: history} };
    }

    @SubscribeMessage('create')
    async createChannel(@ConnectedSocket() client, @MessageBody() data: {name: string, visibility: ChannelVisibility}) {
        const user = await this.auth(client)
        const channel = await this.chatService.createChannel(data.name, user, data.visibility);
        this.chatService.joinChannel(user, channel.id, ChannelMemberRole.ADMIN);
        return { event: "created", data: { channel: channel } };
    }

    @SubscribeMessage('message')
    async handleMsg(@ConnectedSocket() client, @MessageBody() data: {chanId: number, msg: string}) {
        const user = await this.auth(client)
        const message = await this.chatService.createMessage(user, data.msg);
        const channelMessage = await this.chatService.createChannelMessage(data.chanId, message);
        const members = await this.chatService.getChannelMembers(data.chanId);
        console.log(members)
        this.broadcast(user.id, data.chanId, "message", members, { channelMessage: channelMessage });
    }

    @SubscribeMessage('leave')
    async leave(@ConnectedSocket() client, @MessageBody() channelId: number) {
        const user = await this.auth(client)
        await this.chatService.leaveChannel(user, channelId);
        const members = await this.chatService.getChannelMembers(channelId);
        if (members.length == 0)
          this.chatService.deleteChannel(channelId);
        else
          this.broadcast(user.id, channelId, "left", members, { channelId: channelId });
        return { event: "left", data: { channelId: channelId } };
    }

    @SubscribeMessage('chanModeration')
    async ban(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number, action: ChannelModerationType, duration: number, reason: string}) {
        const user = await this.auth(client)
        const admin = await this.chatService.getChannelMember(data.chanId, user.id);
        if (admin.role !== ChannelMemberRole.ADMIN)
            throw new UnauthorizedException('you\'re not an administrator')
        const members = await this.chatService.getChannelMembers(data.chanId);
        this.broadcast(-1, data.chanId, data.action, members, {user: user, duration: data.duration, reason: data.reason})
        this.chatService.createChannelModeration(data.chanId, data.userId, user, data.action, data.reason, data.duration)
    }

    @SubscribeMessage('destroy')
    async destroy(@ConnectedSocket() client, @MessageBody() chanId: number) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(chanId);
        if (user.id != channel.owner.id)
            throw new UnauthorizedException('you\'re not the owner');
        this.chatService.deleteChannel(chanId)
    }

    @SubscribeMessage('change_owner')
    async change_owner(@ConnectedSocket() client, @MessageBody() data: {chanId: number, newOwnerId: number}) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new UnauthorizedException('you\'re not the owner');
        channel.owner = await this.usersService.findOne(data.newOwnerId);
        this.chatService.updateChannel(channel);
    }

    @SubscribeMessage('promote')
    async promote(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number}) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new UnauthorizedException('you\'re not the owner');
        const member = await this.chatService.getChannelMember(channel.id, user.id);
        member.role = ChannelMemberRole.ADMIN;
        this.chatService.updateMember(member);
    }

    @SubscribeMessage('demote')
    async demote(@ConnectedSocket() client, @MessageBody() data: {chanId: number, userId: number}) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(data.chanId);
        if (user.id != channel.owner.id)
            throw new UnauthorizedException('you\'re not the owner');
        const member = await this.chatService.getChannelMember(channel.id, user.id);
        member.role = ChannelMemberRole.MEMBER;
        this.chatService.updateMember(member);
    }

    @SubscribeMessage('invite')
    async invite(@ConnectedSocket() client, @MessageBody() data: {chanId: number, invitedId: number}) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(data.chanId);
        this.chatService.createInvitation(data.chanId, user, data.invitedId)
        this.wsClients.get(data.invitedId).send(JSON.stringify({event: "invited", data: {from: user, channel: channel}}))
        return "ok";
    }

    @SubscribeMessage('join_with_invitation')
    async join_with_invitation(@ConnectedSocket() client, @MessageBody() chanId: number) {
        const user = await this.auth(client)
        const channel = await this.chatService.findChannel(chanId);
        if (!(await this.chatService.isInvited(chanId, user)))
            throw new UnauthorizedException('not invited to chan');
        this.chatService.joinChannel(user, chanId, ChannelMemberRole.MEMBER);
        const history = await this.chatService.getChannelMessages(chanId, new Date(), 100);
        return { event: "joined", data: { channel: channel, history: history} };
    }

    @SubscribeMessage('direct_message')
    async direct_message(@ConnectedSocket() client, @MessageBody() data: {towardId: number, content: string}) {
        const user = await this.auth(client);
        const to = await this.usersService.findOne(data.towardId);
        const message = await this.chatService.createMessage(user, data.content)
        this.wsClients.get(to.id).send(JSON.stringify(await this.chatService.createDirectMessage(to, message)));
        return "ok"
    }
}
