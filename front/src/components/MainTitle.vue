<template>
	<h2 class="font-sans font-bold text-3xl">
    <slot></slot>
  </h2>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';

export default class MainTitle extends Vue {

}
</script>

<style lang="scss">
h2{
	color: $text-title;
}
</style>