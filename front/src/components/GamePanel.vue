<template>
	<div class="flex flex-col justify-between p-7">
		<div>
			<h4 class="text-3xl font-bold">{{title}}</h4>
			<slot></slot>
		</div>
		<button-link @click="action" :text="action_name"/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonLink from '@/components/ButtonLink.vue';

export default defineComponent({
	name: "GamePanel",
	components: {
		ButtonLink,
	},
	props: {
		title: { type: String, default: 'title' },
		action_name: { type: String, default: 'action_name'},
		// link: { type: String, default: 'link'}
	},
	methods: {
			action() {
				this.$emit('action')
			}
	}
})
</script>

<style lang="scss" scoped>
div {
	background-color: $panel-color;
	border-radius: 25px;
	min-height:60vh;
	h4 {
		color: $action;
	}
}
</style>