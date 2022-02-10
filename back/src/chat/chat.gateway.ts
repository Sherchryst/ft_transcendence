import { Res, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException} from '@nestjs/websockets';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { IncomingMessage } from 'http';
import { UsersService } from 'src/users/users.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';

@WebSocketGateway(3001)

export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer() private server: any;
    wsClients = new Map<string, User>();

    constructor(private readonly chatService: ChatService,
        private readonly customJwtService: CustomJwtService,
        private readonly usersService: UsersService) {}

    handleConnection(client: WebSocket, msg: IncomingMessage) {
        let payload
        let user
        try {
            payload = this.customJwtService.verify(msg.headers.cookie.slice(4))
            user = this.usersService.findOne(payload.sub)
            if (user.twofa && !payload.isSecondFactorAuth)
                throw new WsException("")
        }
        catch {
            client.close(1008, "Unauthorized")
            return
        }
        console.log(client.url)
        this.wsClients[payload.sub] = user
    }

    handleDisconnect(client: WebSocket) {
        console.log(client)
    }

    @UseGuards(Jwt2faGuard)
    @SubscribeMessage('join')
    create(@ConnectedSocket() client) {
        console.log(client)
        return {event: "msgHistory", data: "hop"};
    }

    @SubscribeMessage('msg')
    handleMsg() {
    }
}