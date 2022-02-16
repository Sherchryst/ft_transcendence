<template>
    <div class="chat" :key="history">
        <h1>Chat</h1>
        <button v-on:click="go_to_home()">Home</button> <br>
        <span v-if="channel">
            <h2>{{channel.name}}</h2>
            <div v-for="omsg in history" :key="omsg">
                <p>{{omsg}}</p>
            </div>
            <form @submit.prevent="send">
                <input v-model="msg"/>
            </form>
        </span>
        <span v-else>
            <div v-for="chan in listChannel" :key="chan.id">
                <button v-on:click="join(chan.id)">join {{chan.name}}</button>
            </div>
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
            socket : new WebSocket('ws://localhost:3001'),
            history: [],
            msg: "",
            channel: null,
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
                    this.history = fromServer.data.history
                    console.log("channel", this.channel)
                    console.log("history", this.history)
                    break;
                
                case "message":
                    (this.history as any).push(fromServer.data.channelMessage.message.content)
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
            this.socket.send(JSON.stringify({event: 'join', data : chanId}));
        }
    }
})

</script>
