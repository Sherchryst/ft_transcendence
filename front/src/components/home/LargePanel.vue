<template>
    <div class="md:col-span-7 panel col-start-1 max-h-80 overflow-auto">
        <slot></slot>
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

 /* Firefox */
  * {
    scrollbar-width: auto;
    scrollbar-color: #5d6880 #ffffff;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #5d6880;
    border-radius: 10px;
  }
</style>
