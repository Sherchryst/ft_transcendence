<template>
    <div class="md:col-span-10 panel col-start-1">
        <div class="flex flex-col-reverse justify-center md:grid md:grid-cols-5 justify-between h-full ">
            <div class="md:col-span-2">
                <slot name="left"></slot>
            </div>
            <div class="flex content-center md:col-span-3 h-auto panel-dk h-full">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "LargePanel",
})
</script>

<style lang="scss" scoped>
.panel-dk {
  background-color: $panel--dk-color;
  border-radius: 25px;
}
</style>
