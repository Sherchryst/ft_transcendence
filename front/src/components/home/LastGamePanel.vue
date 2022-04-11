<template>
    <div class="flex flex-col h-full justify-evenly">
        <div class="text-xl flex flex-rows">
            <img v-if="$store.getters.getId == match.player1.id" class="image mr-4 h-14 w-14" :src="'http://localhost:3000/' + match.player2.avatarPath">
            <img v-else class="image mr-4 h-14 w-14" :src="'http://localhost:3000/' + match.player1.avatarPath">
            <div v-if="$store.getters.getId == match.player1.id" class="flex flex-col place-items-start">
                <p class='pt-2 font-medium'>{{match.player2.nickname}}</p>
                <p>{{match.player2.login}}</p>
            </div>
            <div v-else class="flex flex-col place-items-start">
                <p class='pt-2 font-medium'>{{match.player1.nickname}}</p>
                <p>{{match.player1.login}}</p>
            </div>
        </div>
        <div class="p-10 w-full result">
            <p v-if='$store.getters.getId == match.winner.id' class="victory font-sans font-bold text-3xl">VICTORY</p>
            <p v-else class="defeat font-sans font-bold text-3xl">DEFEAT</p>
        </div>
        <div  class="pb-10 self-center">
            <div class="flex flex-rows text-6xl">
                <p v-if="$store.getters.getId == match.player1.id" >{{String(match.score1)}}</p>
                <p v-else>{{String(match.score2)}}</p>
                <p class="px-5 font-medium">vs</p>
                <p v-if="$store.getters.getId == match.player1.id">{{String(match.score2)}}</p>
                <p v-else>{{String(match.score1)}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        match: {
            type: Object,
            required: true,
            default: () => ({}),
        },
    }
})
</script>

<style lang="scss" scoped>
.result {
    background-color: $panel-color;
    border-radius: 25px;
}
</style>
