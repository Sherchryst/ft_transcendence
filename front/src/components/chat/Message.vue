<template>
    <div class="message flex"  v-bind:class="[ message.self ? 'flex-row-reverse' : 'flex-row', message.photo ? 'mt-3' : 'mt-2']">
        <div v-if="message.photo">
            <div v-if="!message.self">
                <button class="flex-shrink-0 h-10 w-10" v-s-dropdown-toggle:[messageId]>
                    <img class="h-10 w-10" src="@/assets/blank-avatar.jpg" alt="">
                </button>
                <s-dropdown :name="messageId" position="top" align="right" :offset="30">
                    <UserPanel :channelId="channelId" :user="message.from" :role="role" :owner="owner" :target_role="role"></UserPanel>
                </s-dropdown>
            </div>
            <div v-else>
                <img class="h-10 w-10" src="@/assets/blank-avatar.jpg" alt="">
            </div>
        </div>
        <div v-else class="h-10 w-10">

        </div>
        <div class="p-3 max-w-xl flex-shrink" v-bind:class="[ message.self ? 'text-right mr-3' : 'text-left ml-3' ]" >
             <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Channel } from '@/interfaces/Channel';
import { Message_t } from '@/interfaces/Message';
import { defineComponent, PropType } from 'vue';
import UserPanel from './UserPanel.vue';
import {ChannelMemberRole} from '@/interfaces/Channel';

export default defineComponent({
    name: "Message",
    props: {
        id: { type: Number,  required: true },
        message: { type: Object as PropType<Message_t>, required: true },
        channelId: Number,
        role: { type: String as PropType<ChannelMemberRole>, default: 'member'},
        owner: { type: Boolean, default: true }
    },
    computed: {
        messageId(): string {
            return('message-' + this.id)
        },
    },
    data() {
        return {
            channel: {} as Channel
        }
    },
    created() {
        console.log("role", this.message.from);
    },
    components: { UserPanel }
})
</script>

<style lang="scss" scoped>
.message {
    img {
        background: $bg--lg-color;
        border-radius: 50px;
    }
    .text-left{
        color: $dark-font;
        background: $bg--lg-color;
        border-radius: 0px 10px 10px 10px
    }
    .text-right{
        color: $bg--lg-color;
        background: $action;
        border-radius: 10px 0px 10px 10px
    }
}
</style>