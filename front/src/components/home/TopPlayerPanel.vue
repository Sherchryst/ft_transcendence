<template>
    <div class="flex flex-row justify-between">
        <div>
            <h2 v-if='rank == 1' class="p-1 font-sans font-bold text-3xl" style="color: gold;">{{rank}}</h2>
            <h2 v-else-if="rank == 2" class="p-1 font-sans font-bold text-3xl" style="color: silver;">{{rank}}</h2>
            <h2 v-else-if='rank == 3' class="p-1 font-sans font-bold text-3xl" style="color: #CD7F32;">{{rank}}</h2>
            <h2 v-else class="p-1 font-sans font-bold text-3xl" style="color: lightslategray;">{{rank}}</h2>
        </div>
        <img class="image mr-4 h-15 w-15" src="@/assets/blank-avatar.jpg">
        <div class="flex flex-col pr-3 place-items-end">
            <h2 class='pt-2 font-medium'>{{username}}</h2>
            <p>{{login}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "TopPlayerPanel",
    props: {
        picture: {type: String, default: '@/assets/blank-avatar.jpg'},
        login: {type: String, default: 'Login'},
        username: {type: String, default: 'Username'},
        rank: {type: Number, default: 0},
    }
})
</script>
