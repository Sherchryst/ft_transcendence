<template>
	<div v-if="number" class="felx lg:relative">
		<div class="notification px-2 text-sm ml-3 lg:absolute bottom-0 right-0">
			{{ number }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name:"BadgeNotif",
	props: {
		number: {type: Number, default: 0}
	}
})
</script>

<style lang="scss">
.notification{
	background: $defeat-color;
	color: white;
	border-radius: 20px;
}
</style>