<template>
    <chat-wrapper>
        Coucou
    </chat-wrapper>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">

import { defineComponent } from 'vue';
import { useMeta } from 'vue-meta'
import ChatWrapper from '@/components/ChatWrapper.vue'

export default defineComponent({
    components: {
        ChatWrapper,
    },
    setup () {
        useMeta({ title: 'Chat' })
    },
    data() {
        return {}
    },
    methods: {}
})

</script>
