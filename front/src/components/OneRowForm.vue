<template>
	<form class="one-form-row" @submit.prevent="send" >
		<div class="flex flex-row justify-between">
			<input v-model="response" class="m-2 flex-auto" type="text" :placeholder="placeholder">
			<button class="p-1" type="submit">
				<slot> + </slot>
			</button>
		</div>
	</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		placeholder: { type: String, default: "" },
	},
	data () {
		return {
			response: "",
		}
	},
	methods: {
		send()
		{
			this.$emit('callback', this.response);
			this.response = ""
		}
	}
})
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