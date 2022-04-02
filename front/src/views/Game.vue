<style lang="scss">
  .game{
    overflow: hidden;
    canvas{
      transform: translateX(-50%) translateY(-50%);
      position: absolute;
      left: 0;
      top: 0;
    }
    &-container{
      left: 50%;
      top: 50%;
      height: 80vh;
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
<div class="game">
  <div id="canvas-div" class="game-container w-full relative">
    <canvas ref="background" id="background" class="game-bg" height="600" width="800"></canvas>
    <canvas ref="gamecanvas" id="gamecanvas" class="game-fg" height="600" width="800"></canvas>
  </div>
</div>
</template>

<script lang="ts">
  import {defineComponent, ssrContextKey} from 'vue'
  import { gameSocket } from '../socket';
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
        login : ["player1", "player2"],
        ctx : null as any,
        id : 123,
        map: {
          ballColor : 0,
          backgroundColor : 0,
          starsColor: 0,
          racketColor : 0 
        },
        dimX : 0,
        dimY : 0,
        racket : {
          width: 2,
          x : [6,94]
        },
        board: {
          ball: {x: 400, y: 300, dx: 0, dy: 20, half_width: 25},
          player: [{id:0, y: 300, old_y:300, score: 0, half_height: 40},
                  {id:1, y: 300, old_y:300, score: 0, half_height: 40}],
          dead: false,
          end: false}
      }
    },
    mounted() {
      console.log("mounted");
      gameSocket.emit('connection', this.match_id);
      gameSocket.on("gameMap", (data : any) => {
        this.map = { ...this.map, ...data.map };
        console.log(" my map :", this.map);
        this.login = { ...this.login, ...data.login };
        console.log(" logins :", this.login);
        this.id = data.id;
        console.log(" id :", this.id);
        this.drawBackground();
        console.log('socket connected');
      });
      gameSocket.on("board", (data : any) => {
        this.board = {...this.board, ...data}
        this.clear();
        this.addObjects();
      });
      this.ctx = (this.$refs.gamecanvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
      this.dimX = this.ctx.canvas.width / 100;
      this.dimY = this.ctx.canvas.height / 100;
      document.addEventListener("mousemove", this.moveRackets);
    },
    beforeRouteLeave(to, from, next) {
      console.log("before leave");
      if (this.id == 0 || this.id == 1)
        gameSocket.emit('leave', { match_id : this.match_id, id : this.id });
      next();
    },
    methods:
    {
      roundRect(x : number, y : number, x2 : number, y2 : number, color = "white", ctx : any = null)
      {
        if (ctx == null)
          ctx = this.ctx;
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
      roundStar(x : number, y : number, radius : number, color = "white", ctx : any = null)
      {
        if (ctx == null)
          ctx = this.ctx;
        ctx.fillStyle = color;
        console.log('color', color);
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
        var canvas = this.$refs.background as HTMLCanvasElement;
        if (!canvas)
        {
          console.log("canvas not found");
          return ;
        }
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const interval = ctx.canvas.height / 10;
        const start = ctx.canvas.height / 60;
        const line_width = ctx.canvas.width / 80;
        ctx.fillStyle = "rgb(6, 40, 56)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // ctx.fillStyle = "white";
        for (let count = 0; count < 300; count++) //stars
          this.roundStar(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height, Math.random() * 5, '#' + this.map.starsColor.toString(16), ctx);
          console.log('stars color', this.map.starsColor);
        for (let i = line_width; i < ctx.canvas.width; i+= interval) {
          this.roundRect((ctx.canvas.width- line_width) / 2, i, line_width, interval * 0.65, "white", ctx);
        }
      },
      clear()
      {
          this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      },
      drawBall(x : number, y : number)
      {
        var h_width = this.board.ball.half_width;
        var bColor = '#' + this.map.ballColor.toString(16);
        // console.log('ball color', this.colorballColor);
        if (this.board.ball.dx > 0)
        {
          this.roundRect((x - h_width / 2) * this.dimX, (y - h_width) * this.dimY, h_width * (3 / 2)  * this.dimX, h_width * (5 / 3) * this.dimX, bColor);
          this.roundRect((x - h_width) * this.dimX, (y + h_width / 3) * this.dimY, h_width * (3/2) * this.dimX, h_width * (2 / 3) * this.dimX, bColor);
          this.roundRect((x - h_width) * this.dimX, (y - h_width) * this.dimY, h_width * (3/2) * this.dimX, h_width * (2 / 3) * this.dimX, bColor);
          this.roundRect((x + h_width / 4) * this.dimX, (y - h_width * (3/4)) * this.dimY, (h_width / 2 * this.dimX), h_width * this.dimX, "#AEBBBC");
          this.roundRect((x - h_width / 2) * this.dimX, (y + h_width * (2/3)) * this.dimY, h_width * this.dimX, h_width * (2 / 3) * this.dimX, bColor);
        }
        else
        {
          this.roundRect((x - h_width) * this.dimX, (y - h_width) * this.dimY, h_width * (3 / 2)  * this.dimX, h_width * (5 / 3) * this.dimX, bColor);
          this.roundRect((x - h_width / 2) * this.dimX, (y - h_width) * this.dimY, h_width * (3/2) * this.dimX, h_width * (2 / 3) * this.dimX, bColor);
          this.roundRect((x - h_width / 2) * this.dimX, (y + h_width / 3) * this.dimY, h_width * (3/2) * this.dimX, h_width * (2 / 3) * this.dimX, bColor);
          this.roundRect((x - h_width * (3/4)) * this.dimX, (y - h_width * (3/4)) * this.dimY, (h_width / 2 * this.dimX), h_width * this.dimX, "#AEBBBC");
          this.roundRect((x - h_width / 2) * this.dimX, (y + h_width * (2/3)) * this.dimY, h_width * this.dimX, h_width * (2 / 3) * this.dimX, bColor);
        }
        // this.ctx.fillStyle = "#b8a500";
        // this.ctx.fillRect(0, 0, 400, 50);
        // this.roundRect(0, 0, 400, 50, "white");
        // this.ctx.fillRect(this.ctx.canvas.height, this.ctx.canvas.height, -100, -350);
        // this.roundRect(this.ctx.canvas.height, this.ctx.canvas.height, -100, -350, "white");
      },
      drawRackets(y1 : number, y2 : number)
      {
        this.roundRect((this.racket.x[0] - this.racket.width) * this.dimX, (y1 - this.board.player[0].half_height) * this.dimY, this.racket.width * this.dimX, this.board.player[0].half_height * 2 * this.dimY);
        this.roundRect(this.racket.x[1] * this.dimX, (y2 - this.board.player[1].half_height) * this.dimY, this.racket.width * this.dimX, this.board.player[1].half_height * 2 * this.dimY);
      },
      drawScore()
      {
        this.ctx.fillStyle = "white";
        this.ctx.font = "70px courier new" // absolute size /!\
        this.ctx.textAlign = "right";
        this.ctx.fillText((this.board.player[0].score).toString(), this.ctx.canvas.width / 2 - this.ctx.canvas.width / 20, this.ctx.canvas.height / 10);
        this.ctx.textAlign = "left";
        this.ctx.fillText((this.board.player[1].score).toString(), this.ctx.canvas.width / 2 + this.ctx.canvas.width / 20, this.ctx.canvas.height / 10);
        this.ctx.font = "30px courier new" // absolute size /!\
        this.ctx.textAlign = "right";
        this.ctx.fillText(this.login[1], this.ctx.canvas.width - this.ctx.canvas.width / 10, this.ctx.canvas.height / 10);
        this.ctx.textAlign = "left";
        this.ctx.fillText(this.login[0], this.ctx.canvas.width / 10, this.ctx.canvas.height / 10);
      },
      drawWinner(winner : number)
      {
        this.ctx.fillStyle = "white";
        this.ctx.font = "70px courier new" // absolute size /!\
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.login[winner] + " wins", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
      },
      addObjects()
      {
        if (this.board.end)
          this.drawWinner(this.board.player[0].score > this.board.player[1].score ? 0 : 1);
        else
          this.drawBall(this.board.ball.x, this.board.ball.y);
        this.drawRackets(this.board.player[0].y, this.board.player[1].y);
        this.drawScore();
      },
      moveRackets(evt : MouseEvent)
      {
        if (this.id > 1)
          return ;
        let rect : DOMRect = this.ctx.canvas.getBoundingClientRect();
        console.log("id :", this.id);
        gameSocket.emit('player', {match_id : this.match_id, id : this.id, y : (evt.clientY - rect.top) / this.dimY})
      }
    }
  })
</script>
