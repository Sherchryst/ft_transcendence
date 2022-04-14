<style lang="scss">
  .game{
    overflow: hidden;
    canvas{
      transform: translateX(-50%);
      position: absolute;
      left: 0;
      top: 0;
    }
    &-container{
      left: 50%;
      top: 50%;
      height: calc(100vh - 144px);
    }
    &-bg{
      border: 5px solid $action;
      z-index: 0;
    }
    &-fg{
      border: 5px solid $secondary-color;
      z-index: 1;
    }
  }
</style>

<template>
<div ref="container" class="game" @mousemove="moveRackets">
  <div id="canvas-div" class="game-container w-full relative">
    <canvas ref="background" id="background" class="game-bg" height="600" width="800"></canvas>
    <canvas ref="gamecanvas" id="gamecanvas" class="game-fg" height="600" width="800"></canvas>
  </div>
</div>
</template>

<script lang="ts">
  import { defineComponent, watch } from 'vue'
  import { gameSocket } from '@/socket';
  import { Bot } from '@/interfaces/game/bot.interface';
  import { Board } from '@/interfaces/game/board.interface';
  import { GameMap } from '@/interfaces/game/gameMap.interface';
  import { Dimensions } from '@/interfaces/game/dimensions.interface';
  // import gamecanvas from '@/components/game/gamecanvas.vue';
  // import background from '@/components/game/background.vue';

  export default defineComponent({
    name: 'gamecanvas',
    props: {
      match_id: String,
      msg: String
    },
    // components: {
    //   gamecanvas,
    //   background
    // },
    $refs!: {
      input: HTMLInputElement
    },
    data() {
      return {
        evts : [],
        login : ["", ""],
        nickname : ["you", "bot"],
        move : ("ontouchstart" in window) ? "touchmove" : "mousemove",
        id : 0,
        gameStart : false,
        map: {
          ballColor : 16562691,
          backgroundColor : 344663,
          starsColor: 12566194,
          racketColor : 16777215
        } as GameMap,
        dimX : 1,
        dimY : 1,
        dim : {
          width : 100,
          height : 100,
          racket : {
            width: 2,
            x : [6,94]
          }
        } as Dimensions,
        board : {
          ball : {
            x : 50,
            y : Math.random() * 50 + 25,
            half_width : 2,
            dx :  (Math.floor(Math.random() * 2)? -1:1), //random player
            dy : Math.random() * 1.5 * (Math.floor(Math.random() * 2)? -1:1) }, //random top/bottom
          player : [{
            user_id : "player1",
            id : 0,
            y : 50,
            old_y : 50,
            score : 0,
            half_height : 6 },{
            user_id : "player2",
            id : 1,
            y : 50,
            old_y : 50,
            score : 0,
            half_height : 6 }],
          dead : false,
          end : false,
          ready : true,
          pause_counter : 50 } as Board,
        bot : {
          bot_speed : 2,
          bot_offset : 0,
          bot_id : 1,
        } as Bot
      }
    },
    computed :
    {
      game_canvas: function () { return this.$refs.gamecanvas as HTMLCanvasElement},
      game_ctx: function () { return this.game_canvas.getContext('2d') as CanvasRenderingContext2D},
      bg_canvas: function () { return this.$refs.background as HTMLCanvasElement},
      bg_ctx: function () { return this.bg_canvas.getContext('2d') as CanvasRenderingContext2D}
    },
    created() {
      watch(
        () => this.$route.params.match_id,
        (newId, oldId) => {
          if (oldId){
            console.log("leaving", oldId);
            if (oldId != 'bot') {
              gameSocket.emit('leave', { match_id : oldId, id : this.id });
              gameSocket.off("board");
              gameSocket.off("gameMap");
            }
            document.removeEventListener(this.move, this.moveRackets);
            window.removeEventListener("resize", this.resizeCanvas);
          }
          if (newId) {
            console.log("joining", newId);
            this.initGame(newId.toString());
          }
        }
      )
    },
    mounted() {
      this.initGame(this.$props.match_id);
      // this.dimX = this.game_ctx.canvas.width / 100;
      console.log("mounted", this.game_ctx, this.$props);
      // this.dimY = this.game_ctx.canvas.height / 100;
    },
    beforeRouteLeave(to, from, next) {

      if (!this.board.end && this.$props.match_id != "bot" && (this.id == 0 || this.id == 1)) {
        console.log("leaving");
        gameSocket.emit('leave', { match_id : this.$props.match_id, id : this.id });
      }
      next();
    },
    beforeUnmount() {
      if (this.$props.match_id != "bot" ){
        gameSocket.off("board");
        gameSocket.off("gameMap");
      }
      document.removeEventListener(this.move, this.moveRackets);
      window.removeEventListener("resize", this.resizeCanvas);
    },
    methods:
    {
      initGame(matchId : string | undefined) {
        this.gameStart = false;
        this.board.end = true;
        window.addEventListener("resize", this.resizeCanvas);
        if (matchId == undefined) {
          this.drawVoid();
        }
        else if (matchId != "bot")
        {
          this.drawVoid();
          gameSocket.emit('connection', matchId);
          gameSocket.on("gameMap", (data : {
            map: GameMap,
            login : string[],
            nickname : string[],
            id : number
          }) => {
            this.map = { ...this.map, ...data.map };
            console.log(" my map :", this.map);
            this.login = { ...this.login, ...data.login };
            console.log(" logins :", this.login);
            this.nickname = { ...this.nickname, ...data.nickname };
            console.log(" nicknames :", this.nickname);
            this.id = data.id;
            this.gameStart = true;
            this.resizeCanvas();
            console.log(" id :", this.id);
            // this.drawBackground();
            document.addEventListener(this.move, this.moveRackets);
            // console.log(setuped, 'socket connected');
          });
          gameSocket.on("board", (data : Board) => {
            this.board = { ...this.board, ...data }
            this.addObjects();
          });
        }
        else
        {
          console.log("bot");
          this.gameStart = true;
          this.resizeCanvas();
          // this.reset(true);
          // this.drawBackground();
          console.log(this.game_ctx);
          document.addEventListener(this.move, this.moveRackets);
          // console.log(setuped, 'evts', this.evts);
          this.game_loop();
        }
      },
      resizeCanvas() {
        let container : HTMLElement = this.$refs.container as HTMLElement;
        let containerRect : DOMRect = container.getBoundingClientRect();
        const width = containerRect.right - containerRect.left;
        const height = containerRect.bottom - containerRect.top;
        console.log(width, height, this.$refs.container); // logs 0
        const margin = 20;
        if ((width - margin) * (3/4)  < height - margin) {
          this.game_canvas.width = (width - margin);
          this.game_canvas.height = (width - margin) * (3/4);
        } else {
          this.game_canvas.width = (height - margin) * (4/3);
          this.game_canvas.height = height - margin;
        }
        this.bg_canvas.width = this.game_canvas.width;
        this.bg_canvas.height = this.game_canvas.height;
        this.dimX = this.game_ctx.canvas.width / 100;
        this.dimY = this.game_ctx.canvas.height / 100;
        this.drawBackground();
      },
      roundRect(x : number, y : number, x2 : number, y2 : number, color = "white", ctx : CanvasRenderingContext2D)
      {
        ctx.fillStyle = color;
        const dist_x = x2 > y2? y2 / 3 : x2 / 3;
        ctx.beginPath();
        ctx.arc((x + dist_x), (y + y2 - dist_x), dist_x, Math.PI / 2, Math.PI, false);
        ctx.arc((x + dist_x), (y + dist_x), dist_x, Math.PI, 1.5 * Math.PI, false);
        ctx.arc((x + x2 - dist_x), (y + dist_x), dist_x, 1.5 * Math.PI, Math.PI * 2, false);
        ctx.arc((x + x2 - dist_x), (y + y2 - dist_x), dist_x, 0, Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
      },
      roundStar(x : number, y : number, radius : number, color = "white")
      {
        var ctx = this.bg_ctx;
        ctx.fillStyle = color;
        // console.log('color', color);
        ctx.beginPath();
        // ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.arc(x - radius, y - radius, radius, 0, Math.PI / 2, false);
        ctx.arc(x + radius, y - radius, radius, Math.PI / 2, Math.PI, false);
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
        ctx.arc(x - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.lineWidth = radius / 15;
        ctx.moveTo(x, y - radius * 1.3);
        ctx.lineTo(x, y + radius * 1.3);
        ctx.closePath();
        ctx.stroke();
      },
      drawBackground()
      {
        if (this.gameStart)
        {
          var ctx = this.bg_ctx;
          const interval = ctx.canvas.height / 10;
          const line_width = ctx.canvas.width / 80;
          const starColor = `#${this.map.starsColor.toString(16).padStart(6, '0')}`;
          const lineColor = `#${this.map.racketColor.toString(16).padStart(6, '0')}`;
          const bgColor = `#${this.map.backgroundColor.toString(16).padStart(6, '0')}`;
          ctx.fillStyle = bgColor;
          // console.log("background color", `#${this.map.backgroundColor.toString(16).padStart(6, '0')}`);
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          // ctx.fillStyle = "white";
          if (starColor != bgColor)
            for (let count = 0; count < 300; count++) //stars
              this.roundStar(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height, Math.random() * ctx.canvas.height / 80, starColor);
          for (let i = line_width; i < ctx.canvas.width; i+= interval)
            this.roundRect((ctx.canvas.width- line_width) / 2, i, line_width, interval * 0.65, lineColor, ctx);
          this.drawNames();
        }
        else
          this.drawVoid();
      },
      drawBall(x : number, y : number)
      {
        var ctx = this.game_ctx;
        var h_width = this.board.ball.half_width;
        var bColor = `#${this.map.ballColor.toString(16).padStart(6, '0')}`;
        if (this.board.ball.dx > 0)
        {
          this.roundRect((x - h_width / 2) * this.dimX, (y - h_width) * this.dimY, h_width * (3/2)  * this.dimX, h_width * (5 / 3) * this.dimX, bColor, ctx);
          this.roundRect((x - h_width) * this.dimX, (y + h_width / 3) * this.dimY, h_width * (3/2) * this.dimX, h_width * (2 / 3) * this.dimX, bColor, ctx);
          this.roundRect((x - h_width) * this.dimX, (y - h_width) * this.dimY, h_width * (3/2) * this.dimX, h_width * (2 / 3) * this.dimX, bColor, ctx);
          this.roundRect((x + h_width / 4) * this.dimX, (y - h_width * (3/4)) * this.dimY, (h_width / 2 * this.dimX), h_width * this.dimX, "#AEBBBC", ctx);
          this.roundRect((x - h_width / 2) * this.dimX, (y + h_width * (2/3)) * this.dimY, h_width * this.dimX, h_width * (2 / 3) * this.dimX, bColor, ctx);
        }
        else
        {
          this.roundRect((x - h_width) * this.dimX, (y - h_width) * this.dimY, h_width * (3 / 2)  * this.dimX, h_width * (5 / 3) * this.dimX, bColor, ctx);
          this.roundRect((x - h_width / 2) * this.dimX, (y - h_width) * this.dimY, h_width * (3/2) * this.dimX, h_width * (2 / 3) * this.dimX, bColor, ctx);
          this.roundRect((x - h_width / 2) * this.dimX, (y + h_width / 3) * this.dimY, h_width * (3/2) * this.dimX, h_width * (2 / 3) * this.dimX, bColor, ctx);
          this.roundRect((x - h_width * (3/4)) * this.dimX, (y - h_width * (3/4)) * this.dimY, (h_width / 2 * this.dimX), h_width * this.dimX, "#AEBBBC", ctx);
          this.roundRect((x - h_width / 2) * this.dimX, (y + h_width * (2/3)) * this.dimY, h_width * this.dimX, h_width * (2 / 3) * this.dimX, bColor, ctx);
        }
        // ctx.fillStyle = "#b8a500";
        // ctx.fillRect(0, 0, 400, 50);
        // this.roundRect(0, 0, 400, 50, "white");
        // ctx.fillRect(ctx.canvas.height, ctx.canvas.height, -100, -350);
        // this.roundRect(ctx.canvas.height, ctx.canvas.height, -100, -350, "white");
      },
      drawVoid()
      {
        this.game_ctx.clearRect(0, 0, this.game_ctx.canvas.width, this.game_ctx.canvas.height);
        var ctx = this.bg_ctx;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "white";
        ctx.font = `${ctx.canvas.height / 10}px courier new`; // absolute size /!\
        ctx.textAlign = "center";
        ctx.fillText("No Game To Display", ctx.canvas.width / 2, ctx.canvas.height / 2);
      },
      drawRackets(y1 : number, y2 : number, )
      {
        var ctx = this.game_ctx;
        if (!this.dim)
          return ;
        var rColor = `#${this.map.racketColor.toString(16).padStart(6, '0')}`;
        this.roundRect((this.dim.racket.x[0] - this.dim.racket.width) * this.dimX, (y1 - this.board.player[0].half_height) * this.dimY,
          this.dim.racket.width * this.dimX, this.board.player[0].half_height * 2 * this.dimY, rColor, ctx);
        this.roundRect(this.dim.racket.x[1] * this.dimX, (y2 - this.board.player[1].half_height) * this.dimY,
          this.dim.racket.width * this.dimX, this.board.player[1].half_height * 2 * this.dimY, rColor, ctx);
      },
      drawNames()
      {
        var ctx = this.bg_ctx;
        ctx.fillStyle = "white";
        ctx.font = `${ctx.canvas.height / 20}px courier new`;
        ctx.textAlign = "right";
        ctx.fillText(this.nickname[1], ctx.canvas.width - ctx.canvas.width / 15, ctx.canvas.height / 10);
        ctx.textAlign = "left";
        ctx.fillText(this.nickname[0], ctx.canvas.width / 15, ctx.canvas.height / 10);
        ctx.font = `${ctx.canvas.height / 35}px courier new`;
        ctx.textAlign = "right";
        ctx.fillText(this.login[1], ctx.canvas.width - ctx.canvas.width / 15, ctx.canvas.height / 20);
        ctx.textAlign = "left";
        ctx.fillText(this.login[0], ctx.canvas.width / 15, ctx.canvas.height / 20);
      },
      drawScore()
      {
        var ctx = this.game_ctx;
        ctx.fillStyle = "white";
        ctx.font = `${ctx.canvas.height / 10}px courier new`;
        ctx.textAlign = "right";
        ctx.fillText((this.board.player[0].score).toString(), ctx.canvas.width / 2 - ctx.canvas.width / 30, ctx.canvas.height / 10);
        ctx.textAlign = "left";
        ctx.fillText((this.board.player[1].score).toString(), ctx.canvas.width / 2 + ctx.canvas.width / 30, ctx.canvas.height / 10);
      },
      drawWinner(winner : number)
      {
        var ctx = this.game_ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.bg_ctx.fillStyle = `#${this.map.backgroundColor.toString(16).padStart(6, '0')}`;
        this.bg_ctx.fillRect(0, 0, this.bg_ctx.canvas.width, this.bg_ctx.canvas.height);
        ctx.fillStyle = "white";
        this.drawNames();
        this.drawScore();
        ctx.font = `${ctx.canvas.height / 20}px courier new`; // absolute size /!\
        ctx.textAlign = "center";
        ctx.fillText(this.nickname[winner], ctx.canvas.width / 2, ctx.canvas.height / 2 - ctx.canvas.height / 20);
        ctx.fillText("wins", ctx.canvas.width / 2, ctx.canvas.height / 2 + ctx.canvas.height / 20);
      },
      addObjects()
      {
        // console.log("end : ", this.board.end);
        var ctx = this.game_ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (this.board.end)
          this.drawWinner(this.board.player[0].score > this.board.player[1].score ? 0 : 1);
        else {
            if (this.board.dead)
              ctx.globalAlpha = 0.2;
            this.drawBall(this.board.ball.x, this.board.ball.y);
            ctx.globalAlpha = 1;
          }
        this.drawRackets(this.board.player[0].y, this.board.player[1].y);
        this.drawScore();
      },
      moveRackets(evt : any)
      {
        // console.log("Evt: ", evt);
        if (this.id > 1)
          return ;
        if (this.move == "touchmove")
          evt = evt.touches[0];
        let rect : DOMRect = this.game_ctx.canvas.getBoundingClientRect();
        // console.log("id :", this.id, this.match_id);
        if (this.$props.match_id != "bot")
          gameSocket.emit('player', {match_id : this.$props.match_id, id : this.id, y : (evt.clientY - rect.top) / this.dimY})
        else
          this.updatePlayer(this.id, (evt.clientY - rect.top) / this.dimY);
      },
      updatePlayer(id : number, y : number)
      {
        var player = this.board.player[id];
        if (y < player.half_height) // check if the racket position runs out of the canvas
                player.y = player.half_height;
            else if (y >= this.dim.height - player.half_height)
                player.y = this.dim.height - player.half_height;
        else
          player.y = y;
      },
      racketCollision(dist : number, idx : number, racket_dy : number)
      {
        var ball = this.board.ball;
        const speed_factor = Math.abs(ball.dx) > 2 ? 1 : 1.05;
        ball.dx *= -speed_factor;
        ball.dy = speed_factor * ball.dy + racket_dy
            + dist * Math.abs(ball.dx) / this.board.player[idx].half_height;
        if (Math.abs(ball.dx) * 2 < Math.abs(ball.dy))
          ball.dy = 2 * Math.sign(ball.dy) * Math.abs(ball.dx);
        if (!idx)
          this.bot.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random()
              * this.board.player[this.bot.bot_id].half_height * this.board.ball.dx;
      },
      updateBall()
      {
        var ball = this.board.ball;
        var player = ball.dx < 0? 0 : 1;
        var tmpx = ball.x + ball.dx;
        var tmpy = ball.y + ball.dy;
        if (tmpy - ball.half_width < 0
        || tmpy + ball.half_width >= this.dim.height) // wall collision
            ball.dy = -ball.dy;
        else if ((player == 0 && tmpx - ball.half_width < this.dim.racket.x[0])
        || (player == 1 && tmpx + ball.half_width >= this.dim.racket.x[1]))
        {
          var dist = tmpy - this.board.player[player].y;
          var racket_dy = this.board.player[player].y - this.board.player[player].old_y;
          if (Math.abs(dist) <= this.board.player[player].half_height + ball.half_width && !this.board.dead) //racket collision
            this.racketCollision(dist, player, racket_dy);
          else if (tmpx < -ball.half_width
            || tmpx  >= this.dim.width + ball.half_width) //ball out of map
          {
            this.board.player[player? 0 : 1].score++;
            this.reset(false);
          }
          else //ball behind racket
          {
            this.moveBall();
            if (tmpx < this.dim.racket.x[0]
              || tmpx >= this.dim.racket.x[1])
              this.board.dead = true;
          }
        }
        else
          this.moveBall();
        this.board.player[0].old_y = this.board.player[0].y;
        this.board.player[1].old_y = this.board.player[1].y;
        return ;
      },
      moveBall()
      {
        var ball = this.board.ball;
        ball.x += ball.dx;
        ball.y += ball.dy;
        if (!this.board.dead && this.bot.bot_id ? ball.dx > 0 : ball.dx < 0) // move Bot only if the ball goes in his direction
        {
          const weight = Math.abs((this.dim.racket.x[this.bot.bot_id] - ball.x) / this.dim.width);
          var dy = (weight * this.dim.height / 2
              + (1 - weight) * this.board.ball.y + this.bot.bot_offset)
              - this.board.player[this.bot.bot_id].y;
          this.updatePlayer(this.bot.bot_id, this.board.player[this.bot.bot_id].y + (Math.abs(dy) > Math.abs(this.bot.bot_speed) ? this.bot.bot_speed * Math.sign(dy) : dy)); //limit speed of bot
        }
        // this.updatePlayer(1, ball.y, this.board);
        // this.updatePlayer(0, ball.y, this.board);
      },
      reset(all : boolean)
      {
        if (all)
        {
          this.board.player[0].score = 0;
          this.board.player[1].score = 0;
          this.board.end = false;
        }
        if (this.board.player[0].score >= 11 || this.board.player[1].score >= 11)
          this.board.end = true;
        this.board.pause_counter = 50;
        this.board.dead = false;
        this.board.ball.dx = this.board.ball.x < this.dim.width / 2? -1:1;
        this.board.ball.dy = Math.random() * 1.5 * (Math.floor(Math.random() * 2)? -1:1);
            this.board.ball.x = 50;
            this.board.ball.y = Math.random() * this.dim.height / 2 + this.dim.height / 4;
        this.board.ball.half_width = 2;
        this.board.player[0].half_height = 6;
        this.board.player[1].half_height = 6;
        this.bot.bot_offset = (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random()
              * this.board.player[this.bot.bot_id].half_height * 1.2 * this.board.ball.dx;
      },
      async game_loop()
      {
        this.reset(true);
        while (!this.board.end)
        {
          await this.sleep(20);
          if (this.board.pause_counter > 0)
            this.board.pause_counter--;
          else
            this.updateBall();
          this.addObjects();
        }
        if (!this.gameStart)
          this.drawVoid();
      },
      sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    }
  })
</script>
