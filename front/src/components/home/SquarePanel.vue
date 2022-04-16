<template>
    <div class="md:col-span-4 panel pb-8 p-8 h-auto md:h-80">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "SquarePanel",
})
</script>
