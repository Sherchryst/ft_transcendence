<template>
	<label>
		<input type="checkbox">
		<span class="slider"></span>
	</label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "SwitchButton"
});
</script>

<style lang="scss" scoped>
label {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
	scale: 0.8;
	input {
		opacity: 0;
		width: 0;
		height: 0;
		&:checked + .slider {
			background-color: $action;
			&:before {
				-webkit-transform: translateX(26px);
				-ms-transform: translateX(26px);
				transform: translateX(26px);
			}
		}
		&:focus + .slider {
			box-shadow: 0 0 1px $action;
		}
	}
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		border-radius: 34px;
		outline: #fff 3px solid;
		-webkit-transition: .4s;
		transition: .4s;
		&:before {
			position: absolute;
			content: "";
			height: 26px;
			width: 26px;
			left: 4px;
			bottom: 4px;
			background-color: white;
			border-radius: 50%;
			-webkit-transition: .4s;
			transition: .4s;
		}
	}
}
</style>
