<template>
    <ChatViewWrapper @callback="send" :members="members">
        <template v-slot:title>#-{{channel.name}}</template>
        <!-- <template v-slot:info>
            <InfoPanel></InfoPanel>
        </template> -->
        <template v-slot:option>
            <OptionChannel :channel="channel" :role="role"></OptionChannel>
        </template>
        <template v-if="history.length" v-slot:messages>
            <message v-for="(message, index) in history" :key="index" :message="message" :channelId="parseInt(id)" :id="index" :role="role" :owner="owner">
                {{message.content}}
            </message>
        </template>
    </ChatViewWrapper>
</template>

<script lang="ts">

import { User } from '@/interfaces/Profile'
import { defineComponent, computed, watch, provide } from 'vue';
import Message from '@/components/chat/Message.vue'
import { useMeta } from 'vue-meta'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Message_t, ServerMessage } from '@/interfaces/Message';
import { Channel, ChannelMember_t, ChannelMemberRole } from '@/interfaces/Channel';
import { chatSocket } from '@/socket'
import InfoPanel from '@/components/chat/InfoPanel.vue';
import OptionChannel from '../components/chat/OptionChannel.vue';
import ChatViewWrapper from '@/components/chat/ChatViewWrapper.vue';
import { API } from '@/scripts/auth';
import router from '@/router';
import { AxiosResponse } from 'axios';

export default defineComponent({
    components: {
    Message,
    //InfoPanel,
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
            members: [] as ChannelMember_t[],
            blocked_list: [] as User[],
            role: '' as ChannelMemberRole
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
				if(newId)
					this.getChannelInfo(parseInt(String(newId)));
			}
		)
	},
	mounted() {
        this.getChannelInfo(parseInt(this.id))
        this.socket
            .on('connect', () => {
                console.log('connected', this.socket.id)
            })
            .on('message', (data) => {
                if (this.blocked_list.find((user) => {return user.id == data.channelMessage.message.from.id}))
                    return ;
                if (data.channelMessage.channel.id == this.id) {
                    this.recv(data.channelMessage.message);
                }
            })
            .on('joined', (data) => {
                this.members.push(data);
            })
            .on('left', (id) => {
                let member = {} as ChannelMember_t;
                for (let i = 0; i != this.members.length; ++i)
                    if (this.members[i].id == id) {
                        member = this.members[i];
                        this.members.splice(i);
                        break ;
                    }
            })
        ;
	},  
	methods: {
        send(message: string): void {
            console.log("message : ", message)
            if (message != "") {
                this.socket.emit('message', {
                    chanId: parseInt(this.id),
                    msg : message
                });
            }
		},
		getChannelInfo(chanId: number): void {
            console.log(chanId);
			API.get('chat/channel-info', {params: {channelId: chanId}})
            .then((response: AxiosResponse) => {
                this.channel = response.data.channel
                this.history = []
                for (let i = 0; i < response.data.history.length; ++i)
                    this.recv(response.data.history[i])
                for (let i = 0; i < response.data.members.length; ++i) {
                    this.members.push(response.data.members[i]);
                    if (response.data.members[i].user.id == this.$store.getters.getId)
                        this.role = response.data.members[i].role;
                }
            }).catch((error: Error) => {
                router.push({name: 'not-found', replace: true })
            })
            API.get('users/block-list').then((response) => {
                console.log(response);
                for (let i = 0; i < response.data.length; ++i)
                    this.blocked_list.push(response.data[i]);
            }).catch((error) => {
                console.log(error);
            })
		},
        recv(data: ServerMessage ): void {
            let message: Message_t = {
                content: data.content,
                from: data.from,
                self: false,
                photo: true,
            }
            if (this.$store.getters.getId == message.from.id)
                message.self = true
            if (this.history.length && this.history[0].from.id == message.from.id)
                message.photo = false
            this.history.unshift(message)
        }
	}
})

</script>
