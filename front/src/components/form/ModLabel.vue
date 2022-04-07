<template>
	<label :for="name" class="text-left mb-2"><slot></slot></label>
</template>

<style lang="scss">
label, .label{
	color: $dark-font;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "ModLabel",
	props: {
		name: { type: String, default: "my-input"},
	}
})
</script>