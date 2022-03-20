<style>
  html, 
  body {
      margin: 0;
      padding: 0;
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
        map: {
          ballColor : 0,
          backgroundColor : 0,
          starsColor: 0,
          racketColor : 0 
        },
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
      console.log("asking for params");
      this.ctx = (this.$refs.mycanvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
      this.dimX = this.ctx.canvas.width / 100;
      this.dimY = this.ctx.canvas.height / 100;
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
            this.id = fromServer.data.id;
            this.map = fromServer.data.map;
            this.drawBackground();
            console.log(this.id);
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
        var ctx = (this.$refs.background as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
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
