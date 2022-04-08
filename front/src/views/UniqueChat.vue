<template>
    <chat-wrapper hasConv>
        <!-- <div class="col-span-8 conversation flex flex-col justify-between px-7 py-5"> -->
			<div class="flex flex-row justify-between items-center">
				<div>Channel Name</div>
				<div class="flex flex-row">
					<button>
						<info-icon class="h-10"></info-icon>
					</button>
					<button>
						<option-icon class="h-10"></option-icon>
					</button>
				</div>
			</div>
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

import { defineComponent, PropType, computed, watch } from 'vue';
import Message from '@/components/chat/Message.vue'
import OneRowForm from '@/components/OneRowForm.vue'
import SendIcon from '@/assets/icon/send.svg';
import ChatWrapper from '@/components/chat/ChatWrapper.vue'
import { useMeta } from 'vue-meta'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Message_t, ServerMessage } from '@/interfaces/Message.ts'
import { chatSocket } from '@/socket.ts'
import InfoIcon from '@/assets/icon/info.svg'
import OptionIcon from '@/assets/icon/option.svg'

export default defineComponent({
    components: {
        Message,
        SendIcon,
        ChatWrapper,
        OneRowForm,
		InfoIcon,
		OptionIcon
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
            socket : chatSocket,
            history: [] as Message_t[],
            msg: "",
            channel: null,
        }
    },
    created(): void {
		watch(
			() => this.$route.params.id,
			(newId) => {
				if(newId) {
					this.join(parseInt(newId[0]))
				}
			}
		)
	},
	mounted() {
        this.join(parseInt(this.id))
        this.socket
            .on('connect', () => {
                console.log('connected', this.socket.id)
            })
            .on('joined', (data) => {
                console.log('joined')
                this.channel = data.channel
                this.history = []
                for (let i = 0; i < data.history.length; i++)
                    this.recv(data.history[i])
            })
            .on('message', (data) => {
                if (data.channelMessage.channel.id == this.id)
                    this.recv(data.channelMessage.message)
                this.readMessage(parseInt(this.id))
            })
        ;
	},
    updated() {
        console.log('update')
    },
	methods: {
        readMessage(chanId: number){
            this.$emit('read-message', chanId);
        },
        send(message: string): void {
            console.log("message : ", message)
			this.socket.emit('message', {
                chanId: parseInt(this.id),
                msg : message
            });
		},

		join(chanId: number): void {
			this.socket.emit('join', {
                channelId: chanId,
                password: ""
            });
            this.readMessage(chanId)
		},

		leave_channel(): void {
			this.socket.emit('leave', this.id);
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
