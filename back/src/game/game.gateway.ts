import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { Board } from "./interfaces/board.interface";
import { MatchService } from "./match.service";
import { CustomJwtService, getJwtFromSocket } from "src/auth/jwt/jwt.service";
import { UsersService } from "src/users/users.service";
import { WsJwt2faGuard } from "src/auth/jwt/jwt.guard";
import { Req, UseGuards } from "@nestjs/common";
import { Match, MatchType } from "./entities/match.entity";
import { GameMap } from "./entities/game-map.entity";
import { MatchInvitation } from "./entities/match-invitation.entity";

const interval = 20;
let pending_player = -1;
const boards = new Map<string, Board>();
const basic_board: Board = {
  ball: {
    x: 50,
    y: Math.random() * 50 + 25,
    half_width: 2,
    dx: Math.floor(Math.random() * 2) ? -1 : 1, //random player
    dy: Math.random() * 1.5 * (Math.floor(Math.random() * 2) ? -1 : 1),
  }, //random top/bottom
  player: [
    {
      user_socket: "player1",
      user_id: -1,
      id: 0,
      y: 50,
      old_y: 50,
      score: 0,
      half_height: 6,
    },
    {
      user_socket: "player2",
      user_id: -1,
      id: 1,
      y: 50,
      old_y: 50,
      score: 0,
      half_height: 6,
    },
  ],
  dead: false,
  end: false,
  pause_counter: 50,
  level: 2,
  start: false
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@UseGuards(WsJwt2faGuard)
@WebSocketGateway(3001, { namespace: "game" })
export class GameGateway implements OnGatewayConnection {
  static startGame() {
    throw new Error("Game : Method not implemented.");
  }

  WsClients = new Map<number, Socket>();

  @WebSocketServer()
  server: Server;
  constructor(
    private readonly gameService: GameService,
    private readonly matchService: MatchService,
    private readonly customJwtService: CustomJwtService,
    private readonly usersService: UsersService
  ) {}

  afterInit() {
    this.server.emit("testing", { do: "stuff" });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const jwt = getJwtFromSocket(socket);
      const payload = this.customJwtService.verify(jwt);
      const user = await this.usersService.findOne(payload.sub);
      if (user.twofa && !payload.isSecondFactorAuth) throw new WsException("");
      // console.log("allo", user.id, socket.id, this.WsClients)
      this.WsClients.set(user.id, socket);
    } catch (reason) {
      // console.log("Game: Unauthorized connection", reason);
      socket.disconnect(false);
      return;
    }
    console.log("Game : New connection to socket");
  }

  async updateAchievements(user_id: number) {
    // const achievements = await this.usersService.getUserAchievements(user_id);
    try {
      if (await this.matchService.winCount(user_id) >= 1) {
        await this.usersService.unlockAchievement(user_id, 1); // win 1
      }
      if (await this.matchService.winCount(user_id) >= 10) {
        await this.usersService.unlockAchievement(user_id, 2); // win 1
      }
      const history = await this.matchService.getHistory(user_id, 5);
      if (history.filter((match) => match.winner.id == user_id).length >= 5) {
        await this.usersService.unlockAchievement(user_id, 3); // win 5 in a row
      }
      else if (history.filter((match) => match.winner.id != user_id).length >= 5) {
        await this.usersService.unlockAchievement(user_id, 4); // lose 5 in a row
      }
      if (history[0].winner.id == user_id
      && (history[0].score1 == 0 || history[0].score2 == 0)) {
        await this.usersService.unlockAchievement(user_id, 5); // fanny
      }
    }
    catch (e) {}
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    // --> put score of other player to 11 in bd
    // this.WsClients.delete(req.user?.id);
    try {
      let player_id: number;
      this.WsClients.forEach((value, key) => {
        if (value == socket) {
          if (pending_player == key)
            pending_player = -1;
          boards.forEach((board, match_id) => {
            if (board.player[0].user_socket == value.id) player_id = 0;
            else if (board.player[1].user_socket == value.id) player_id = 1;
            else return;
            board.player[player_id == 0 ? 1 : 0].score = 11;
            board.end = true;
            if (!board.start)
            {
              this.matchService.deleteMatch(parseInt(match_id));
              boards.delete(match_id);
              return;
            }
            this.server
              .to(`game:${match_id}`)
              .emit("board", this.gameService.updateBall(board));
            // this.server.socketsLeave(`game:${match_id}`);
          });
          this.WsClients.delete(key);
        }
      });
      console.log("Game : disconnection from socket");
    } catch (e) {
      console.log("Game : Error while disconnecting");
    }
  }

  @SubscribeMessage("invite")
  async handleInvite(
    @Req() req: any,
    @MessageBody() data: { login: string; mapId: number; level: number }
  ) {
    const to_user = await this.usersService.findByLogin(data.login);
    if (to_user == null) console.log("Game : User not found");
    // error
    else if (data.login == req.user.login)
      console.log("Game : You can't invite yourself");
    // error
    else {
      try {
        const map = await this.matchService.findGameMap(data.mapId);
        const invitation = await this.matchService.createMatchInvitation(
          req.user.id,
          to_user.id,
          map,
          data.level
        );
        this.WsClients.get(to_user.id).emit("invited", invitation);
        console.log("Game : Invitation sent to", to_user.login);
      } catch (e) {
        console.log("Game : Error while sending invitation"); // error
      }
      // console.log("invitation", invitation)
      // while(!this.WsClients.has(to_user.id))
      //   await sleep(5000);
    }
  }

  createBoard(id: number, player1: string, player2: string): Board {
    const board = JSON.parse(JSON.stringify(basic_board));
    board.player[0].user_socket = player1;
    board.player[1].user_socket = player2;
    // board.setReady = () => {};
    board.isReady = new Promise<boolean>((resolve) => {
      board.setReady = () => {
        resolve(true);
      };
    });
    boards.set(`${id}`, board);
    return board;
  }

  async createMatch(
    map: GameMap,
    player1: number,
    player2: number | null,
    matchType: MatchType,
    level: number
  ): Promise<Match> {
    if (Math.random() < 0.5) {
      const tmp = player1;
      player1 = player2;
      player2 = tmp;
    }
    const match = await this.matchService.createMatch(
      map,
      player1,
      player2,
      matchType,
      level
    );
    // console.log("Match created : (in create match) ", match.id);
    const player1_socket = this.WsClients.get(match.player1.id);
    const player2_socket = this.WsClients.get(match.player2.id);
    this.createBoard(match.id, player1_socket.id, player2_socket.id);
    const board = boards.get(`${match.id}`);
    board.player[0].user_id = match.player1.id;
    board.player[1].user_id = match.player2.id;
    player1_socket.join(`game:${match.id}`);
    player2_socket.join(`game:${match.id}`);
    this.server.to(`game:${match.id}`).emit("gameStart", match.id);
    return match;
  }

  @SubscribeMessage("matchmaking")
  async handleMatchmaking(@Req() req: any) {
    try {
      if (pending_player >= 0 && pending_player != req.user.id) {
        const pendingId = pending_player;
        pending_player = -1;
        const map = await this.matchService.findGameMap(1);
        if (!map) {
          console.log("Game : Error while finding map"); // error
          return;
        }
        await this.createMatch(
          map,
          pendingId,
          req.user.id,
          MatchType.RANKED,
          2
        );
      } else pending_player = req.user.id;
    } catch (e) {
      console.log("Game : Error while creating match"); // error
    }
  }

  @SubscribeMessage("acceptInvit")
  async handleAcceptInvit(@MessageBody() data: MatchInvitation) {
    // console.log("data", data);
    try {
      const matchInvit = await this.matchService.findMatchInvitation(
        data.to.id,
        data.from.id
      );
      if (matchInvit == null) console.log("Game : No invitation found");
      // error
      else {
        await this.createMatch(
          matchInvit.map,
          matchInvit.to.id,
          matchInvit.from.id,
          MatchType.CASUAL,
          matchInvit.level
          );
        await this.matchService.deleteMatchInvitation(data.from.id, data.to.id);
      }
    } catch (e) {
      console.log("Game : Error while accepting invitation"); // error
    }
  }

  @SubscribeMessage("declineInvit")
  async handleDeclineInvit(@MessageBody() data: MatchInvitation) {
    try {
      await this.matchService.deleteMatchInvitation(data.from.id, data.to.id);
    } catch (e) {
      console.log("Game : Error while declining invitation"); // error
    }
  }

  @SubscribeMessage("connection")
  async handleMessage(
    @MessageBody() id: number,
    @ConnectedSocket() socket: Socket
  ) {
    try
    {
      const board: Board = boards.get(`${id}`);
      const match = await this.matchService.findMatch(id);
      let player_id: number;
  
      if (board.player[0].user_socket == socket.id) player_id = 0;
      else if (board.player[1].user_socket == socket.id) player_id = 1;
      else player_id = 2;
      socket.emit("gameMap", {
        id: player_id,
        map: match.map,
        login: [match.player1.login, match.player2.login],
      }); //change to specific map
      if (player_id == 0) {
        board.isReady.then(() => {
          console.log(
            "Game : New match",
            id,
            ":",
            match.player1.login,
            "vs",
            match.player2.login
          );
          board.level = match.level;
          this.sendUpdateBoard(id);
        });
      } else if (player_id == 1) {
        board.setReady();
      }
    } catch (e) {
      console.log("Game : Error while finding match"); // error
    }
  }

  @SubscribeMessage("leaveMatchmaking")
  handleLeaveMatchmaking(
  //   @MessageBody() data: { match_id: number; id: number },
    @ConnectedSocket() socket: Socket
  ) {
    try {
      this.WsClients.forEach((value, key) => {
        if (value == socket && pending_player == key)
            pending_player = -1;
      });
    } catch (e) {}
  }

  @SubscribeMessage("leave")
  async handleLeave(
    @MessageBody() data: { match_id: number; id: number },
    @ConnectedSocket() socket: Socket
  ) {
    try {
      const board = boards.get(`${data.match_id}`);
      if ((data.id == 0 || data.id == 1) &&
      board.player[data.id].user_socket == socket.id) {
        board.player[data.id == 0 ? 1 : 0].score = 11;
        board.end = true;
        if (!board.start)
        {
          this.matchService.deleteMatch(data.match_id);
          boards.delete(`${data.match_id}`);
          return;
        }
        this.server
          .to(`game:${data.match_id}`)
          .emit("board", this.gameService.updateBall(board));
      }
      this.server.socketsLeave(`game:${data.match_id}`);
    } catch (e) {}
    console.log("Game : Player left game");
  }

  @SubscribeMessage("player")
  handlePlayer(
    @MessageBody() data: { match_id: number; id: number; y: number }
  ) {
    // console.log("match_id (player): ", data.match_id);
    if (data.id != 0 && data.id != 1) return;
    try {
      // console.log ("BOARDS :", boards.keys());
      const board = boards.get(`${data.match_id}`); //match id
      //check player id
      this.gameService.updatePlayer(data.id, data.y, board);
    } catch (e) {}
  }

  async sendUpdateBoard(id: number) {
    try
    {
      const board = boards.get(`${id}`);
      // console.log("id : \n", id, "boards :\n", boards, "board:", board);
      if (board.level != 2) {
        board.ball.dx *= board.level / 2;
        board.ball.dy *= board.level / 2;
        board.player[0].half_height *= 2 / board.level;
        board.player[1].half_height *= 2 / board.level;
      }
      board.start = true;
      while (!board.end) {
        await sleep(interval);
        if (board.pause_counter > 0) {
          if (board.pause_counter == 1)
            this.matchService.updateScore(
              id,
              board.player[0].score,
              board.player[1].score
            );
          board.pause_counter--;
        } else this.gameService.updateBall(board);
        this.server.to(`game:${id}`).emit("board", board);
      }
      const match = await this.matchService.findMatch(id);
      this.usersService.updateXP(board.player[0].user_id,
      ((await this.usersService.findOne(board.player[0].user_id)).xp)
      + (board.player[0].score == 11 ? 50 : board.player[0].score * 2) * (match.mode == MatchType.CASUAL ? 1 : 2));
      this.usersService.updateXP(board.player[1].user_id,
        ((await this.usersService.findOne(board.player[1].user_id)).xp)
        + (board.player[1].score == 11 ? 50 : board.player[1].score * 2) * (match.mode == MatchType.CASUAL ? 1 : 2));
        await this.matchService.setWinner(
          id,
          board.player[0].score > board.player[1].score
          ? match.player1.id
          : match.player2.id
          );
          await this.matchService.updateScore(
        id,
        board.player[0].score,
        board.player[1].score
        );
        console.log(
        "Game : Match",
        id,
        "ended, score:",
        board.player[0].score,
        "-",
        board.player[1].score
        );
        this.server.socketsLeave(`game:${id}`);
        boards.delete(`${id}`);
        this.updateAchievements(board.player[0].user_id);
        this.updateAchievements(board.player[1].user_id);
    } catch (e) {}
  }
}
