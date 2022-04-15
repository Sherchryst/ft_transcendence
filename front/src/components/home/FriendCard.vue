<template>
    <div class="grid justify-items-stretch">
        <div class="m-5 justify-self-center">
            <router-link v-if="friend.status == 'online'" :to="{name: 'profile', params: {username: friend.login}}">
                <img  class="ring-4 ring-green-300 ring-opacity-90 image h-15 w-15" :src="'http://localhost:3000/' + friend.avatarPath">
            </router-link>
            <router-link v-else-if="friend.status == 'in game' && friend.message != ''" :to="{name: 'game', params: {match_id: friend.message}}">
                <img  class="ring-4 ring-indigo-400 animate-pulse ring-opacity-90 image h-15 w-15" :src="'http://localhost:3000/' + friend.avatarPath">
            </router-link>
            <router-link v-else-if="friend.status == 'offline'" :to="{name: 'profile', params: {username: friend.login}}">
                <img  class="ring-4 ring-gray-400 ring-opacity-80 image h-15 w-15" :src="'http://localhost:3000/' + friend.avatarPath">
            </router-link>
            <router-link v-else :to="{name: 'profile', params: {username: friend.login}}">
                <img class=" image h-15 w-15" :src="'http://localhost:3000/' + friend.avatarPath">
            </router-link>
        </div>
        <div class="overflow-clip">
            <p>{{friend.login}}</p>
            <p class='pt-2 bold font-medium truncate ' style="font-weight: bold;">{{friend.nickname}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '@/interfaces/Profile';

export default defineComponent({
    name: "FriendCard",
    props: {
        friend: {
            type: Object as () => User,
            required: true,
        },
    },
})
</script>

<style lang="scss">
.friend-card {
  background-color: white;
  border-radius: 10px;
}
</style>