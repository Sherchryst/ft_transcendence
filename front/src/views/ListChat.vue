<template>
    <div>
        <div class="grid-cols-1 md:grid grid-cols-3 span-4 mb-5">
            <one-row-form placeholder="#-chan-name" @callback="create" >
                <span class="px-2">Create</span>
            </one-row-form>
        </div>
<<<<<<< HEAD
        <div class="grid-cols-1 md:grid grid-cols-3 gap-4 span-4" :key="listChannel">
=======
        <div class="grid-cols-1 md:grid grid-cols-3 gap-4 span-4">
>>>>>>> main
            <channel-view v-for="chan in listChannel" :id="chan.id" :title="chan.name" :key="chan.id"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { API } from '@/scripts/auth.ts';
import { useMeta } from 'vue-meta'
import ChannelView from '@/components/chat/ChannelView.vue'
import OneRowForm from '@/components/OneRowForm.vue'
<<<<<<< HEAD
import { chatSocket } from '@/socket.ts'
import { Channel } from '@/interfaces/Channel'
=======
>>>>>>> main

export default defineComponent ({
    components: {
        ChannelView,
        OneRowForm,
    },
    beforeRouteLeave(to, from, next) {
<<<<<<< HEAD
=======
        this.socket.close()
>>>>>>> main
        next()
    },
    setup () {
        useMeta({ title: 'Channels' })
    },
    data() {
        return {
<<<<<<< HEAD
            socket : chatSocket,
            listChannel: [] as Channel[],
        }
    },
    mounted() {
        this.socket
            .on("connect", () => {
                console.log("Connected, ", this.socket.id);
            })
            .on("disconnect", (reason) => {
                console.log("Deconnected", reason);
            })
            .on("created", (data: {channel: Channel}) => {
                this.listChannel.push(data.channel)
            })
        ;
=======
            socket : new WebSocket('ws://localhost:3001/chat'),
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
>>>>>>> main
        API.get('chat/list').then((response) => {
            this.listChannel = response.data
            console.log(this.listChannel);
        }).catch((error) => {
            this.listChannel = [];
        })
    },
    methods: {
        create(name_chan: string): void {
<<<<<<< HEAD
            this.socket.emit("create", {
                name : name_chan, 
                visibility : "public"
            })
=======
			this.socket.send(JSON.stringify({event: 'create', data : {name : name_chan, visibility : "public"}}));
>>>>>>> main
		},
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