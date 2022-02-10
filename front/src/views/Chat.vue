<template>
    <div class="chat">
        <h1>Chat</h1>
        <button v-on:click="go_to_home()">Home</button> <br>
        <span v-if="onChannel">
        <p>{{othermsg}}</p>
            <form @submit.prevent="send">
                <input v-model="msg"/>
            </form>
        </span>
        <span v-else>
            <input v-model="name"/>
            <button v-on:click="join()">join</button>
        </span>
    </div>
</template>

<script lang="ts">

import router from '@/router';
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            socket : new WebSocket('ws://localhost:3001'),
            othermsg: "othermsg",
            msg: "msg",
            name: "name",
            onChannel: false
        }
    },
    mounted() {
        this.socket.onopen = () => {
            console.log('connected', this.socket)
        }
        this.socket.onclose = (reason) => {
            console.log('disconnected', reason)
        }
        this.socket.onmessage = (event) => {
            const fromServer = JSON.parse(event.data)
            switch (fromServer.event) {
                case "msgHistory":
                    this.othermsg = fromServer.data
                    console.log(fromServer.data)
                    break;
                case "newMsg":
                    this.othermsg = fromServer.data
                    console.log(fromServer.data)
                    break;
            }
        }
    },
    methods: {
        go_to_home(): void {
            router.push('/')
        },

        send(): void {
            this.socket.send(JSON.stringify({event: 'msg', data : this.msg}))
        },

        join(): void {
            this.socket.send(JSON.stringify({event: 'join', data: this.name}))
        }
    }
})

</script>