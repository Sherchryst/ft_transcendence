<template>
	<form :action="action" :method="method">
		<div class="flex flex-row justify-between">
			<input class="m-2 flex-auto focus-visible:outline-0" type="text" :placeholder="placeholder">
			<button class="p-1" type="submit">
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
		},
		placeholder: {
			type: String,
			default: ""
		}
	}
})

export default class OneButtonLink extends Vue {
	action!: string
	placeholder!: string
}
</script>

<style lang="scss" scoped>
	$line-widht: 3px;

	form{
		// outline: $line-widht solid transparent;
		div{
			background: $bg--lg-color;
			border-radius: 10px;
			background-clip: padding-box;
			transition: all 100ms ease-in;
			&:hover{
				// outline: $line-widht darken($color: $bg-action, $amount: 20%) solid;
				background: lighten($color: $bg--lg-color, $amount: 5%);
				input{
					background: lighten($color: $bg--lg-color, $amount: 5%);
				}
			}
			&:focus-within{
				outline: $line-widht $action solid;
				background: $bg--lg-color;
				background: lighten($color: $bg--lg-color, $amount: 5%);
			}
		}
		input{
			transition: all 100ms ease-in;
			background: $bg--lg-color;
			color: $panel--dk-color;
			&:focus-visible{
				outline: unset;
				background: lighten($color: $bg--lg-color, $amount: 5%)
			}
		}
		button{
			background: $bg-action;
			color: $action;
			border-radius: 9px;
		}
	}
</style>