<template>
	<div class="around justify-center shadow-xl">
		{{text}}
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    text: String
  }
})
</script>

<style lang="scss">
.around {
  display: inline-block;
  border-radius: 94px;
  background-color: lightgrey;
  width: 65px;
}
</style>
