<template>
    <div class="flex flex-col h-full justify-between">
        <div class="text-xl flex flex-rows">
            <img class="image mr-4 h-14 w-14" src="@/assets/blank-avatar.jpg">
            <div class="flex flex-col place-items-start">
                <h2 class='pt-2 font-medium'>{{username}}</h2>
                <p>{{login}}</p>
            </div>
        </div>
        <div class="p-10 w-full result">
            <h2 v-if='result' class="victory font-sans font-bold text-3xl">VICTORY</h2>
            <h2 v-else class="defeat font-sans font-bold text-3xl">DEFEAT</h2>
        </div>
        <div class="pb-10 self-center">
            <div class="flex flex-rows text-6xl">
                <p>{{first}}</p>
                <h2 class="px-5 font-medium">vs</h2>
                <p>{{second}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        username: {type: String, default: 'Username'},
        login: {type: String, default: 'Login'},
        first: {type: Number, default: 0},
        second:{type: Number, default: 0},
        result: { type: Boolean, default: false },
    }
})
</script>

<style lang="scss" scoped>
.result {
    background-color: $panel-color;
    border-radius: 25px;
}
</style>
