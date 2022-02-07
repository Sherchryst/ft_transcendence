<template>
    <div class="chat">
        <h1>Chat</h1>
        <button v-on:click="go_to_home()">Home</button>
    </div>
</template>

<script lang="ts">

import router from '@/router';
import { defineComponent } from 'vue';

export default defineComponent({
    methods: {
        go_to_home(): void {
            router.push('/')
        }
    }
})

</script>