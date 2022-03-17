<template>
	<h2 class="font-sans font-bold text-3xl">
    <slot></slot>
  </h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

})
</script>

<style lang="scss">
h2{
	color: $text-title;
}
</style>