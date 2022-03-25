<template>
    <chat-wrapper hasConv>
        <!-- <div class="col-span-8 conversation flex flex-col justify-between px-7 py-5"> -->
            <div id="chat" class="flex-auto flex flex-col-reverse mb-5 overflow-x-auto" :key="history">
                <message :self="message.self" v-for="message in history" :key="message">
                    {{message.content}}
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

import { defineComponent, PropType, computed } from 'vue';
import Message from '@/components/chat/Message.vue'
import OneRowForm from '@/components/OneRowForm.vue'
import SendIcon from '@/assets/icon/send.svg';
import ChatWrapper from '@/components/chat/ChatWrapper.vue'
import { useMeta } from 'vue-meta'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Message_t, ServerMessage } from '@/interfaces/Message.ts'
import {chatSocket} from '../socket'

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

        return {
            nickname: computed( () => store.getters.getNickname)
        }
    },
    data() {
        return {
            history: [] as Message_t[],
            msg: "",
            channel: null,
        }
    },
	mounted() {
        chatSocket.on("connect", () => {
            console.log('connected')
            if (this.id)
                this.join(parseInt(this.id))
		});
		chatSocket.on("disconnect", (reason) => {
			console.log('disconnected', reason)
		})
        chatSocket.on("joined", (data: any) => {
            this.channel = data.channel
            this.history = []
            for (let i = 0; i < data.history.length; i++) {
                this.recv(data.history[i])
            }
            console.log("channel", this.channel)
            console.log("history", this.history)
        })
        chatSocket.on("message", (data: any) => {
            console.log("message : ", data)
            this.recv(data.channelMessage.message)
        })  
        chatSocket.on("left", (data: any) => {
			this.channel = null
        })
        chatSocket.on("error", (data: any) => {
            console.log(data)
        })
	},
	methods: {
        send(message: string): void {
            chatSocket.emit('message', {chanId: parseInt(this.id), msg : message})
		},

		join(chanId: number): void {
            chatSocket.emit('join', {channelId: parseInt(this.id), password: ""})
		},

		leave_channel(): void {
            chatSocket.emit('leave', this.id)
		},
        recv(data: ServerMessage ): void {
            let message: Message_t = {
                content: data.content,
                from: data.from.nickname,
                self: false
            }
            if (this.nickname == message.from)
                message.self = true
            this.history.unshift(message)
        }
	}
})

</script>
