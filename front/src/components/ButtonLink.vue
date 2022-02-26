<template>
	<router-link :to="route" class="button px-7 py-3 pb-2">{{ text }}</router-link>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    text: {
		type: String,
		default: "action"
	},
	route: {
		type: String,
		default: "/"
	}
  }
})
export default class ButtonLink extends Vue {
  text!: string
  route!: string
}
</script>

<style lang="scss" scoped>
button, a, .button{
	color: $action;
	background: $bg-action;
	border-radius: 10px;
}

</style>