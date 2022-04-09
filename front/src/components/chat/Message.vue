<template>
    <div class="message flex my-3" v-bind:class="[ message.self ? 'flex-row-reverse' : 'flex-row' ]">
        <div v-if="!message.self">
            <button class="flex-shrink-0 h-10 w-10" v-s-dropdown-toggle:message->
                <img class="h-10 w-10" src="@/assets/blank-avatar.jpg" alt="">
            </button>
            <s-dropdown name="message-" position="top" :offset="30">
                <UserPanel :channelId="channelId"></UserPanel>
            </s-dropdown>
        </div>
        <div v-else>
            <img class="h-10 w-10" src="@/assets/blank-avatar.jpg" alt="">
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

export default defineComponent({
    name: "Message",
    props: {
        message: { type: Object as PropType<Message_t>, required: true },
        channelId: Number,
    },
    data() {
        return {
            channel: {} as Channel
        }
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