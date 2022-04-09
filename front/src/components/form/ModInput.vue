<script lang="ts">
import { defineComponent } from "vue";
import ModLabel from "./ModLabel.vue";

export default defineComponent({
    name: "ModInput",
    props: {
        name: { type: String, default: "my-input" },
        type: { type: String, default: "text" },
        placeholder: { type: String, default: "" },
		modelValue: { type: String, default: ""}
    },
    components: { ModLabel },
})
</script>

<template>
	<div class="mod-input flex flex-col justify-start">
		<ModLabel name="name"><slot></slot></ModLabel>
		<div class="input-div flex flex-shrink">
			<input :name="name" :type="type" :placeholder="placeholder" class="m-2 w-full" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
		</div>
	</div>
</template>

<style lang="scss">
	$line-widht: 1px;
	$--hover-bg-color: #fff;

	.mod-input{
		.input-div{
			background: #fff;
			border-radius: 10px;
			&:hover{
				background: $--hover-bg-color;
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
		&.mobile{
			div {
				outline: $line-widht $action solid;
				background: $bg--lg-color;
				background: $--hover-bg-color;
			}
		}
	}
</style>