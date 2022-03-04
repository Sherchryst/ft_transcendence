<template>
    <div class="grid-cols-1 md:grid grid-cols-3 span-4">
        <div class="chan flex flex-row justify-between px-4 py-3">
            <!-- <div v-for="chan in listChannel" :key="chan.id"> -->
                <div class="flex flex-col items-start">
                    <!-- {{chan.name}} -->
                    <span class="title font-bold text-xl">#Chan-name</span>
                    <span class="font-light">Username</span>
                </div>
                <button v-on:click="join(chan.id)">join</button>
            <!-- </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useMeta } from 'vue-meta'

export default defineComponent ({
    setup () {
        useMeta({ title: 'Channels' })
    },
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
.chan{
    border-radius: 12px;
    .title{
        color: $dark-font;
    }
    &:hover{
        background: $panel-color;
    }
}
</style>