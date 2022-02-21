<template>
    <div v-for="chan in listChannel" :key="chan.id">
        <div>
            {{chan.name}}
            <button v-on:click="join(chan.id)">join</button>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent ({
    data() {
        return {
            socket : new WebSocket('ws://localhost:3001'),
            listChannel: [],
        }
    },
    mounted() {
        axios.get('http://localhost:3000/chat/list').then((response) => {
            this.listChannel = response.data
        }).catch((error) => {
            console.log(error)
        })
    },
    methods: {
        join(chanId: number): void {
            this.socket.send(JSON.stringify({event: 'join', data : chanId}));
        }
    }
})
</script>

<style lang="scss" scoped>

</style>