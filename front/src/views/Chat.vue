<template>
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
</template>

<script lang="ts">

import router from '@/router';
import { defineComponent } from 'vue';
import axios from 'axios';



export default defineComponent({
    data() {
        return {
            socket : new WebSocket('ws://localhost:3002'),
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
        go_to_home(): void {
            router.push('/')
        },

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
