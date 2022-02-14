<template>
	<form :action="action" :method="method">
		<div class="flex flex-row">
			<input class="m-1" type="text">
			<button class="px-3" type="submit">
				<slot> + </slot>
			</button>
		</div>
	</form>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
	props: {
		action: String,
		method: {
			type: String,
			default: "POST"
		}
	}
})

export default class OneButtonLink extends Vue {
	action!: string
}
</script>

<style lang="scss" scoped>
	form{
		div{
			background: $panel-color;
			border-radius: 10px;
		}
		input{
			background: $panel-color;
		}
		button{
			background: $bg-action;
			color: $action;
			border-radius: 11px;
		}
	}
</style>