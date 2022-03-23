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
    <canvas ref="background" id="background" class="game-bg" height="750" width="850">
    </canvas>
    <canvas ref="mycanvas" id="mycanvas" class="game-fg" height="600" width="800"></canvas>
  </div>
</div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue'
  // import VueSocketIO from 'vue-3-socket.io'
  import { socket } from '../socket';
  // import VueSocketIO from "vue-socket.io";
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
        // socket : new io("ws://localhost:3001") as unknown,
        ctx : null as any
        }
    },
    sockets: {
        connect: function () {
            console.log('socket connected');
			console.log("connect", socket.id);
        },
        customEmit: function () {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    methods: {
        clickButton: function (data: string) {
            // $socket is socket.io-client instance
            socket.emit('emit_method', data)
        }
    },
    // created() {
    //   // var io = require("socket.io-client");
    //   // socket = io("http://localhost:3001");
    //   // console.log("Connection socket", socket);
    // },
    mounted() {
      console.log("asking for params");
      // this.ctx = (this.$refs.mycanvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
      // this.dimX = this.ctx.canvas.width / 100;
      // this.dimY = this.ctx.canvas.height / 100;
      // console.log("DIMS :", this.dimX, this.dimY)
       socket.on("connect", () => {
      console.log("Connect", socket.id); // x8WIv7-mJelg7on_ALbx
      });
      socket.on("disconnect", () => {
      console.log("Disc", socket.id); // undefined
    });
    }
  })
</script>
