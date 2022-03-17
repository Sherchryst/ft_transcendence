<template>
	<router-link :to="{name: route}" class="button px-7 py-3 pb-2">{{ text }}</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: "ButtonLink",
	props: {
		text: { type: String, default: "action" },
		route: { type: String, default: "home" }
	}
})
</script>

<style lang="scss" scoped>
button, a, .button{
	color: $action;
	background: $bg-action;
	border-radius: 10px;
}

</style>