<template>
	<div class="chan flex flex-row justify-between px-4 py-3">
			<div class="flex flex-col items-start">
				<span class="title font-bold text-xl">#-{{this.title}}</span>
				<span class="font-light">Username</span>
			</div>
			<button>join</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		title: {type: String, required: true}
	},
})
</script>

<style lang="scss" scoped>
.chan{
    border-radius: 12px;
    .title{
        color: $dark-font;
    }
    &:hover{
        background: $panel-color;
    }
}
</style>