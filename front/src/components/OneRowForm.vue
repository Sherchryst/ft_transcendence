<template>
	<form class="one-form-row" :action="action" :method="method">
		<div class="flex flex-row justify-between">
			<input class="m-2 flex-auto" type="text" :placeholder="placeholder">
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

<style lang="scss">
	$line-widht: 1px;
	$--hover-bg-color: #fff;

	.one-form-row{
		// outline: $line-widht solid transparent;
		div{
			background: #fff;
			border-radius: 10px;
			background-clip: padding-box;
			transition: all 100ms ease-in;
			&:hover{
				// outline: $line-widht darken($color: $bg-action, $amount: 20%) solid;
				background: $--hover-bg-color;
				// outline: $line-widht $action solid;
				input{
					transition: all 100ms ease-in;
					background: $--hover-bg-color;
					&::placeholder{
						color: $action;
				}
				}
			}
			&:focus-within{
				outline: $line-widht $action solid;
				background: $bg--lg-color;
				background: $--hover-bg-color;
			}
		}
		input{
			transition: all 100ms ease-in;
			background: #fff;
			color: $action;
			&:focus-visible{
				outline: unset;
				background: $--hover-bg-color;
				&::placeholder{
					color: $text-primary !important;
				}
			}
		}
		button{
			background: $action;
			color: #fff;
			border-radius: 0px 9px 9px 0px;
			svg {
				fill : #fff;
			}
		}
		&.mobile{
			div {
				outline: $line-widht $action solid;
				background: $bg--lg-color;
				background: $--hover-bg-color;
			}
		}
	}
</style>