<template>
    <div class="grid grid-cols-5 justify-items-stretch w-auto">
        <div class="justify-self-start mt-1">
            <h2 v-if='rank == 1' class="p-1 font-sans font-bold text-3xl" style="color: gold;">{{rank}}</h2>
            <h2 v-else-if="rank == 2" class="p-1 font-sans font-bold text-3xl" style="color: silver;">{{rank}}</h2>
            <h2 v-else-if='rank == 3' class="p-1 font-sans font-bold text-3xl" style="color: #CD7F32;">{{rank}}</h2>
            <h2 v-else class="p-1 font-sans font-bold text-3xl" style="color: lightslategray;">{{rank}}</h2>
        </div>
        <router-link :to="{name: 'profile', params: {username: player.login}}">
            <img class="image mt-2 h-15 w-15 invisible lg:visible justify-self-end" :src="'http://localhost:3000/' + player.avatar_path">
        </router-link>
        <div class="flex flex-col pr-3 place-items-end justify-self-end col-start-5">
            <h2 class='pt-2 font-medium'>{{player.nickname}}</h2>
            <p>{{player.login}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "TopPlayerPanel",
    props: {
        player: {
            type: Object,
            required: true,
        },
        rank: {
            type: Number,
            required: true,
        },
    }
})
</script>
