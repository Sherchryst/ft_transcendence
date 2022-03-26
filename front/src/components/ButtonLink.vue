<template>
	<router-link v-if="route" :to="{name: route}" class="button px-7 py-3 pb-2">{{ text }}</router-link>
	<a v-else :href="href" class="button px-7 py-3 pb-2">{{ text }}</a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: "ButtonLink",
	props: {
		text: { type: String, default: "action" },
		route: { type: String },
		href: { type: String }
	}
})
</script>

<style lang="scss" scoped>
button, a, .button{
	color: $action;
	background: $bg-action;
	border-radius: 10px;
	cursor: pointer;
}

</style>