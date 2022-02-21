<template>
  <div class="chat grid grid-cols-12 gap-5">
      <div class="col-span-4 list flex flex-col px-7 py-5">
          <h4 class="text-left font-bold text-xl mb-4" >Messages directs</h4>
          <discussion-preview class="active" />
          <discussion-preview />
          <discussion-preview />
          <h4 class="text-left font-bold text-xl mt-4" >Channels</h4>
          <discussion-preview isChannel="true"/>
      </div>
      <div class="col-span-8 conversation flex flex-col justify-between px-7 py-5">
          <div class="flex-auto mb-5 overflow-x-auto">
            <message side="1">
                Lorem ipsum dolor
            </message>
            <message side="0">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
          </div>
          <one-row-form placeholder="Message">Send</one-row-form>
      </div>
      <div class="chat" :key="history">
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
  </div>
</template>

<style lang="scss" scoped>
.chat{
    > div{
        height: 77vh;
        border-radius: 25px;
    }
    .list{
        background: $panel-color;
        h4 {
            color: $bg--lg-color;
        }
    }
    .conversation{
        background: $panel--dk-color;
    }
}
</style>

<!-- <template>
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
</template> -->

<script lang="ts">

import router from '@/router';
import { defineComponent } from 'vue';
import axios from 'axios';
import DiscussionPreview from '@/components/DiscussionPreview.vue'
import Message from '@/components/Message.vue'
import OneRowForm from '@/components/OneRowForm.vue'



export default defineComponent({
    components: {
        DiscussionPreview,
        Message,
        OneRowForm,
    },
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
