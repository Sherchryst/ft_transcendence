<template>
    <chat-wrapper hasConv>
        <!-- <div class="col-span-8 conversation flex flex-col justify-between px-7 py-5"> -->
            <div id="chat" class="flex-auto flex flex-col-reverse mb-5 overflow-x-auto" :key="history">
                <message side="0" v-for="omsg in history" :key="omsg">
                    {{omsg.content}}
                </message>
            </div>
            <one-row-form placeholder="Message" @callback="send">
                <span class="flex flex-row items-center">
                    <span class="hidden md:flex pl-2 pr-1">Envoyer</span>
                    <SendIcon/>
                </span>
           </one-row-form>
      <!-- </div> -->
    </chat-wrapper>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
    #chat{
        // background: #E2E3F2;
        // border-radius: 25px;
        // height: 77vh;
    }
</style>

<script lang="ts">

import { defineComponent } from 'vue';
import Message from '@/components/chat/Message.vue'
import OneRowForm from '@/components/OneRowForm.vue'
import SendIcon from '@/assets/icon/send.svg';
import ChatWrapper from '@/components/chat/ChatWrapper.vue'
import { useMeta } from 'vue-meta'
import { useStore } from 'vuex'
import { key } from '@/store'

export default defineComponent({
    components: {
        Message,
        SendIcon,
        ChatWrapper,
        OneRowForm,
    },
    props : {
        id: {type: String, required: true},
        name: {type : String}
    },
    beforeRouteLeave(to, from, next) {
        next()
    },
    setup () {
        useMeta({ title: 'Chat' })

        const store = useStore(key)
    },
    data() {
        return {
            socket : {} as WebSocket,
            history: [],
            msg: "",
            channel: null,
        }
    },
    unmounted() {
        this.socket.close();
    },
	mounted() {
        this.socket = new WebSocket('ws://localhost:3001/chat');
        this.socket.onopen = () => {
            console.log('connected', this.socket)
            if (this.id && this.socket)
                this.join(parseInt(this.id))
		}
		this.socket.onclose = (reason) => {
			console.log('disconnected', reason)
		}
		this.socket.onmessage = (msg) => {
            console.log("message");
			const fromServer = JSON.parse(msg.data)
			console.log(fromServer)
			switch (fromServer.event) {
				case "joined":
                    this.channel = fromServer.data.channel
					this.history = []
					for (let i = 0; i < fromServer.data.history.length; i++) {
                        (this.history as any).unshift({content: fromServer.data.history[i].content, from: fromServer.data.history[i].from.nickname})
					}
					console.log("channel", this.channel)
					console.log("history", this.history)
					break;
				case "message":
                    (this.history as any).unshift({content: fromServer.data.channelMessage.message.content, from: fromServer.data.channelMessage.message.from.login})
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
	},
	methods: {
        send(message: string): void {
			this.socket.send(JSON.stringify({event: 'message', data: {chanId: parseInt(this.id), msg : message}}))
		},

		join(chanId: number): void {
            console.log("alo");
			this.socket.send(JSON.stringify({event: 'join', data : {channelId: parseInt(this.id), password: ""}}));
		},

		leave_channel(): void {
			this.socket.send(JSON.stringify({event: 'leave', data : this.id}));
		}
	}
})

</script>
