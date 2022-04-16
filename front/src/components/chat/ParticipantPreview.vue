<template>
    <div class="chat">
        <router-link :to="{name: 'profile', params: {username: user.user.login}}">
            <div class="mr-5">
                <img class="h-16 w-16" :src="'http://localhost:3000/' + user.user.avatarPath" alt="_profile">
            </div>
        </router-link>
        <div class="text-left">
            <p class="username text-lg">{{user.user.nickname}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Member_t } from '@/interfaces/Channel';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DiscussionPreview",
    props: {
        user: {
            type: Object as () => Member_t,
            default: () => ({}),
        },
    },
})
</script>

<style lang="scss" scoped>
.chat-preview{
    transition: background 120ms ease-in;
    cursor: pointer;
    img {
        background: $bg--lg-color;
        border-radius: 50px;
    }
    > div > p {
        color: $action;
    }
    &:hover{
        background: $bg-action;
    }
    &.router-link-exact-active{
        background: $panel-color;
        &> div > p {
            color: $dark-font;
        }
        .username{
            font-weight: bold;
        }
        .last-message{
            display: none;
        }
    }
    border-radius: 16px;
}
</style>