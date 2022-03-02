<template>
  <div class="chat grid grid-cols-12 gap-5">
      <div class="col-span-4 list flex flex-col pr-7">
          <h4 class="text-left font-bold text-xl mb-4" >Messages directs</h4>
          <discussion-preview id="0232839723" />
          <discussion-preview id="3463992320" />
          <discussion-preview id="9834934920" />
          <h4 class="text-left font-bold text-xl mt-4" >Channels</h4>
          <discussion-preview isChannel />
      </div>
      <router-view/>
      <div class="chat" :key="history ">
        <h1>Chat</h1>
        <button v-on:click="go_to_home()">Home</button> <br>
        <span v-if="channel">
            <h2>{{channel.name}}</h2>
            <div v-for="omsg in history" :key="omsg">
                <p>{{omsg.from}}: {{omsg.content}}</p>
            </div>
            <form @submit.prevent="send">
                <input v-model="msg"/>
            </form>
            <button v-on:click="leave_channel()">Leave</button>
        </span>
        <span v-else>
            <div v-for="chan in listChannel" :key="chan.id">
                <button v-on:click="join(chan.id)">join {{chan.name}}</button>
            </div>
            <input v-model="newChan">
            <button v-on:click="create()">create</button>
        </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat{
    > div{
        height: 77vh;
        border-radius: 25px;
    }
    .list{
        // background: $panel-color;
        h4 {
            color: $dark-font;
        }
    }
}
</style>

<!-- <template>
    <div class="chat" :key="history ">
        <h1>Chat</h1>
        <button v-on:click="go_to_home()">Home</button> <br>
        <span v-if="channel">
            <h2>{{channel.name}}</h2>
            <div v-for="omsg in history" :key="omsg">
                <p>{{omsg.from}}: {{omsg.content}}</p>
            </div>
            <form @submit.prevent="send">
                <input v-model="msg"/>
            </form>
            <button v-on:click="leave_channel()">Leave</button>
        </span>
        <span v-else>
            <div v-for="chan in listChannel" :key="chan.id">
                <button v-on:click="join(chan.id)">join {{chan.name}}</button>
            </div>
            <input v-model="newChan">
            <button v-on:click="create()">create</button>
        </span>
    </div>
</template> -->

<script lang="ts">

import router from '@/router';
import { defineComponent } from 'vue';
import axios from 'axios';
import DiscussionPreview from '@/components/DiscussionPreview.vue'
import { useMeta } from 'vue-meta'



export default defineComponent({
    components: {
        DiscussionPreview,
    },
    setup () {
        useMeta({ title: 'Chat' })
    },
    data() {
        return {
            socket : new WebSocket('ws://localhost:3001'),
            history: [],
            msg: "",
            channel: null,
            newChan: "",
            listChannel: [],
        }
    },
    mounted() {
        this.socket.onopen = () => {
            console.log('connected', this.socket)
        }
        this.socket.onclose = (reason) => {
            console.log('disconnected', reason)
        }
        this.socket.onmessage = (msg) => {
            const fromServer = JSON.parse(msg.data)
            console.log(fromServer)
            switch (fromServer.event) {
                case "joined":
                    this.channel = fromServer.data.channel
                    this.history = []
                    for (let i = 0; i < fromServer.data.history.length; i++) {
                        (this.history as any).push({content: fromServer.data.history[i].content, from: fromServer.data.history[i].from.nickname})
                    }
                    console.log("channel", this.channel)
                    console.log("history", this.history)
                    break;
                case "message":
                    (this.history as any).push({content: fromServer.data.channelMessage.message.content, from: fromServer.data.channelMessage.message.from.login})
                    console.log(fromServer.data)
                    break;
                
                case "created":
                    this.channel = fromServer.data.channel
                    this.history = []
                    console.log("channel", this.channel)
                    console.log("history", this.history)
                    break;

                case "left":
                    this.channel = null
                    break;
            }
        }
        axios.get('http://localhost:3000/chat/list').then((response) => {
            this.listChannel = response.data
        }).catch((error) => {
            console.log(error)
        })
    },
    methods: {
        send(): void {
            console.log((this.channel as any).id)
            this.socket.send(JSON.stringify({event: 'message', data: {chanId: (this.channel as any).id, msg : this.msg}}))
        },

        join(chanId: number): void {
            this.socket.send(JSON.stringify({event: 'join', data : {channelId: chanId, password: ""}}));
        },

        create(): void {
            this.socket.send(JSON.stringify({event: 'create', data : {name : this.newChan, visibility : "public"}}));
        },

        leave_channel(): void {
            this.socket.send(JSON.stringify({event: 'leave', data : (this.channel as any).id}));
        }
    }
})

</script>
