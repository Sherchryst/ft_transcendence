<style>
  html, 
  body {
      margin: 0;
      padding: 0;
      /* background-color:rgb(6, 40, 56); */
  }
  #background {
    border: 5px solid #b8a500;
  }
  #mycanvas {
    border: 5px solid #b8a500;
  }
</style>

<template>
<div id="canvas-div" style="position: relative;">
 <canvas ref="background" id="background" width="800" height="600"
   style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>
 <canvas ref="mycanvas" id="mycanvas" width="800" height="600"
   style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>
</div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue'

  export default defineComponent({
    name: 'mycanvas',
    props: {
      msg: String
    },
    $refs!: {
    input: HTMLInputElement
    },
    data() {
      return {
        socket : new WebSocket('ws://localhost:3001'),
        ctx : null as any,
        id : 123,
        login : ["player1", "player2"],
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
    created() {
      console.log("Connection socket", this.socket);
    },
    mounted() {
      this.drawBackground();
      console.log("asking for params");
      this.ctx = (this.$refs.mycanvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
      this.dimX = this.ctx.canvas.width / 100;
      this.dimY = this.ctx.canvas.height / 100;
      // console.log("DIMS :", this.dimX, this.dimY)
      this.socket.onopen = () => {
          console.log('Connected');
          this.socket.send(JSON.stringify({event: 'connection', data : "HEY !"})); // faudra changer les dimensions selon la taille de l'ecran
      }
      this.socket.onmessage = (evt) => {
        const fromServer = JSON.parse(evt.data);
        switch (fromServer.event) {
          case "board":
            this.board = { ...this.board, ...fromServer.data }
            this.clear();
            this.addObjects();
            break;
          case "id":
            this.id = fromServer.data;
            console.log(this.id);
          //   console.log("Updated board", this.board)
            break;
          case "login":
            this.login[fromServer.data.id] = fromServer.data.login;
            break;
        }
      document.addEventListener("mousemove", this.moveRackets);
      }
    },
    methods:
    {
      drawRect(x : number, y : number, x2 : number, y2 : number, color = "white", ctx : any = null)
      {
        if (ctx == null)
          ctx = this.ctx;
        ctx.fillStyle = color;
        const dist_x = x2 > y2? y2 / 3 : x2 / 3;
        // const dist_y = y2 / 2 - dist_x;
        ctx.beginPath();
        ctx.arc((x + dist_x), (y + dist_x), dist_x, 0, 2 * Math.PI, false);
        ctx.arc((x + x2 - dist_x), (y + y2 - dist_x), dist_x, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.arc((x + x2 - dist_x), (y + dist_x), dist_x, 0, 2 * Math.PI, false);
        ctx.arc((x + dist_x), (y + y2 - dist_x), dist_x, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(x, y + dist_x , x2, (y2 - 2 * dist_x));
        ctx.fillRect((x + dist_x), y, (x2 - 2 * dist_x), y2);
      },
      // drawCircle(x : number, y : number, radius : number, color = "white")
      // {
      //   this.ctx.fillStyle = color;
      //   this.ctx.beginPath();
      //   this.ctx.arc(x * this.dimX, y * this.dimY, radius * this.dimX, 0, 2 * Math.PI, false);
      //   this.ctx.fill();
      // },
      drawBackground()
      {
        var ctx = (this.$refs.background as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
        const interval = ctx.canvas.height / 10;
        const start = ctx.canvas.height / 60;
        const line_width = ctx.canvas.width / 80;
        ctx.fillStyle = "rgb(6, 40, 56)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // ctx.fillStyle = "white";
          for (let i = line_width; i < ctx.canvas.width; i+= interval) {
            this.drawRect((ctx.canvas.width- line_width) / 2, i, line_width, interval * 0.65, "white", ctx);
          }
      },
      clear()
      {
          this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      },
      drawBall(x : number, y : number)
      {
        if (this.board.ball.dx > 0)
        {
          this.drawRect((x - this.board.ball.half_width / 2) * this.dimX, (y - this.board.ball.half_width) * this.dimY, this.board.ball.half_width * (3 / 2)  * this.dimX, this.board.ball.half_width * (5 / 3) * this.dimX, "#b8a500");
          this.drawRect((x - this.board.ball.half_width) * this.dimX, (y + this.board.ball.half_width / 3) * this.dimY, this.board.ball.half_width * (3/2) * this.dimX, this.board.ball.half_width * (2 / 3) * this.dimX, "#b8a500");
          this.drawRect((x - this.board.ball.half_width) * this.dimX, (y - this.board.ball.half_width) * this.dimY, this.board.ball.half_width * (3/2) * this.dimX, this.board.ball.half_width * (2 / 3) * this.dimX, "#b8a500");
          this.drawRect((x + this.board.ball.half_width / 4) * this.dimX, (y - this.board.ball.half_width * (3/4)) * this.dimY, (this.board.ball.half_width / 2 * this.dimX), this.board.ball.half_width * this.dimX, "#AEBBBC");
          this.drawRect((x - this.board.ball.half_width / 2) * this.dimX, (y + this.board.ball.half_width * (2/3)) * this.dimY, this.board.ball.half_width * this.dimX, this.board.ball.half_width * (2 / 3) * this.dimX, "#b8a500");
        }
        else
        {
          this.drawRect((x - this.board.ball.half_width) * this.dimX, (y - this.board.ball.half_width) * this.dimY, this.board.ball.half_width * (3 / 2)  * this.dimX, this.board.ball.half_width * (5 / 3) * this.dimX, "#b8a500");
          this.drawRect((x - this.board.ball.half_width / 2) * this.dimX, (y - this.board.ball.half_width) * this.dimY, this.board.ball.half_width * (3/2) * this.dimX, this.board.ball.half_width * (2 / 3) * this.dimX, "#b8a500");
          this.drawRect((x - this.board.ball.half_width / 2) * this.dimX, (y + this.board.ball.half_width / 3) * this.dimY, this.board.ball.half_width * (3/2) * this.dimX, this.board.ball.half_width * (2 / 3) * this.dimX, "#b8a500");
          this.drawRect((x - this.board.ball.half_width * (3/4)) * this.dimX, (y - this.board.ball.half_width * (3/4)) * this.dimY, (this.board.ball.half_width / 2 * this.dimX), this.board.ball.half_width * this.dimX, "#AEBBBC");
          this.drawRect((x - this.board.ball.half_width / 2) * this.dimX, (y + this.board.ball.half_width * (2/3)) * this.dimY, this.board.ball.half_width * this.dimX, this.board.ball.half_width * (2 / 3) * this.dimX, "#b8a500");
        }
      },
      drawRackets(y1 : number, y2 : number)
      {
        this.drawRect((this.racket.x[0] - this.racket.width) * this.dimX, (y1 - this.board.player[0].half_height) * this.dimY, this.racket.width * this.dimX, this.board.player[0].half_height * 2 * this.dimY);
        this.drawRect(this.racket.x[1] * this.dimX, (y2 - this.board.player[1].half_height) * this.dimY, this.racket.width * this.dimX, this.board.player[1].half_height * 2 * this.dimY);
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
        // this.ctx.fillText("wins", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 70);
      },
      addObjects()
      {
        if (this.board.end)
          this.drawWinner(this.board.player[0].score >= 11 ? 0 : 1)
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
        // this.board.player[0].y = evt.clientY - rect.top;
        this.socket.send(JSON.stringify({event: 'player', data : {"id" : this.id, "y" : (evt.clientY - rect.top) / this.dimY}}));
        this.updatePlayer(this.id, (evt.clientY - rect.top) / this.dimY);
      },
      updatePlayer(id : number, y : number)
      {
        var player = this.board.player[id];
        if (y < player.half_height) // check if the racket position runs out of the canvas
                player.y = player.half_height;
            else if (y >= 100 - player.half_height)
                player.y = 100 - player.half_height;
        else
          player.y = y;
      }
    }
  })
</script>
