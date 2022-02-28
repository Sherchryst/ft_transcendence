<template>
	<div class="around justify-center shadow-xl">
		{{text}}
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    text: String
  }
})

export default class Level extends Vue {
	text!: string
}
</script>

<style lang="scss">
.around {
  display: inline-block;
  border-radius: 94px;
  background-color: lightgrey;
  width: 65px;
}
</style>
