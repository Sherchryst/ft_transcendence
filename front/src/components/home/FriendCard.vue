<template>
    <div class="grid justify-items-stretch">
        <div class="m-5 justify-self-center">
            <img v-if="friend.status == 'online'" class="ring-4 ring-green-300 ring-opacity-90 image h-15 w-15" :src="'http://localhost:3000/' + friend.avatarPath">
            <router-link v-else-if="friend.status == 'in game' && friend.message != ''" :to="{name: 'game', params: {match_id: friend.message}}">
                <img  class="ring-4 ring-indigo-400 animate-pulse ring-opacity-90 image h-15 w-15" :src="'http://localhost:3000/' + friend.avatarPath">
            </router-link>
            <img v-else-if="friend.status == 'offline'" class="ring-4 ring-gray-400 ring-opacity-80 image h-15 w-15" :src="'http://localhost:3000/' + friend.avatarPath">
            <img v-else class=" image h-15 w-15" :src="'http://localhost:3000/' + friend.avatarPath">
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