<template>
    <div class="col-span-10 panel col-start-1">
        <div class="flex flex-row justify-between h-full place-content-center ">
            <slot name="left"></slot>
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "LargePanel",
})
</script>
