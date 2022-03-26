<template>
	<router-link v-if="route" :to="{name: route}" class="btn px-7 py-3 pb-2">{{ text }}</router-link>
	<a v-else :href="href" class="btn px-7 py-3 pb-2">{{ text }}</a>
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
button, a, .btn{
	color: $action;
	background: $bg-action;
	border-radius: 10px;
	cursor: pointer;
}

.btn{
	&-neutral{
		color: $panel--dk-color;
		background: $panel-color;
	}
}

</style>