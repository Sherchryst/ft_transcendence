<template>
    <ChatViewWrapper @callback="send">
        <template v-slot:title>#-{{channel.name}}</template>
        <template v-slot:info>
            <InfoPanel></InfoPanel>
        </template>
        <template v-slot:option>
            <OptionChannel :channel="channel"></OptionChannel>
        </template>
        <template v-if="history.length" v-slot:messages>
            <message v-for="message in history" :key="message" :message="message" :channelId="parseInt(id)">
                {{message.content}}
            </message>
        </template>
    </ChatViewWrapper>
</template>

<script lang="ts">

import { defineComponent, computed, watch, provide } from 'vue';
import Message from '@/components/chat/Message.vue'
import { useMeta } from 'vue-meta'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Message_t, ServerMessage } from '@/interfaces/Message'
import { Channel } from '@/interfaces/Channel';
import { chatSocket } from '@/socket'
import InfoPanel from '@/components/chat/InfoPanel.vue';
import OptionChannel from '../components/chat/OptionChannel.vue';
import ChatViewWrapper from '@/components/chat/ChatViewWrapper.vue';

export default defineComponent({
    components: {
    Message,
    InfoPanel,
    OptionChannel,
    ChatViewWrapper
},
    props : {
        id: {type: String, required: true},
        name: {type : String}
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
            channel: {} as Channel,
        }
    },
    computed: {
        owner() :boolean {
            return (this.channel.owner?.id == this.$store.getters.getId)
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
            console.log("Owner ?", this.owner);
		},
        recv(data: ServerMessage ): void {
            let message: Message_t = {
                content: data.content,
                from: data.from,
                self: false,
                photo: true,
            }
            if (this.nickname == message.from.nickname)
                message.self = true
            if (this.history.length && this.history[0].from.id == message.from.id)
                message.photo = false
            this.history.unshift(message)
        }
	}
})

</script>
