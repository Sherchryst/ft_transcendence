import { forwardRef, Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { IncomingMessage } from "http";
import { CustomJwtService } from "src/auth/jwt/jwt.service";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@WebSocketGateway(3002, {path: "/status"})
export class UsersGateway implements OnGatewayConnection {
    wsClients = new Map<number, any>();

    constructor(
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

    private async auth(client: any): Promise<User> {
        return this.usersService.findOne(this.customJwtService.verify(client.jwt).sub)
    }

    async handleDisconnect(client: any) {
        const user = await this.auth(client);
        this.wsClients.delete(user.id)
    }

    @SubscribeMessage('update')
    async update(@ConnectedSocket() client, @MessageBody() status: string) {
        await this.auth(client);
        this.wsClients.forEach((user) => {
            if (client !== user)
                user.send(JSON.stringify({ event: 'update', data: status}));
        })
    }

    @SubscribeMessage('request')
    async request(@ConnectedSocket() client, @MessageBody() targetId: number) {
        const user = await this.auth(client);
        this.wsClients.get(targetId).send(JSON.stringify({event: 'request', data: user.id}))

    }

    @SubscribeMessage('send')
    async send(@ConnectedSocket() client, @MessageBody() data: {targetId: number, status: string}) {
        await this.auth(client);
        this.wsClients.get(data.targetId).send(JSON.stringify({event: 'send', data: {from: data.targetId, status: data.status}}))
    }
}