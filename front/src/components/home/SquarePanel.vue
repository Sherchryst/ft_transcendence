<template>
    <div class="col-span-3 panel pb-8 p-8 h-full">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "SquarePanel",
})
</script>
