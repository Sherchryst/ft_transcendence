import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, BaseWsExceptionFilter } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { getJwtFromSocket } from 'src/auth/jwt/jwt.service';
import { ClassSerializerInterceptor, Req, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { WsJwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { instanceToPlain } from 'class-transformer';

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
        if (await this.chatService.isMuted(req.user, data.chanId))
            return  
        const message = await this.chatService.createMessage(req.user, data.msg);
        const channelMessage = await this.chatService.createChannelMessage(data.chanId, message);
        this.server.in("channel:" + data.chanId).emit("message", { channelMessage: instanceToPlain(channelMessage) });
        } catch (error) {
            client.send("error", error)
        }
    }

    @SubscribeMessage('direct_message')
    async direct_message(@Req() req, @ConnectedSocket() client, @MessageBody() data: {towardId: number, content: string}) {
        try {
            const to = await this.usersService.findOne(data.towardId);
            const message = await this.chatService.createMessage(req.user, data.content)
            this.wsClients.get(to.id).send(instanceToPlain(await this.chatService.createDirectMessage(to, message)));
        }
        catch (error) {
            client.send("error", error);
        }
    }
}
