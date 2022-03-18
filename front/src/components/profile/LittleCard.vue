<template>
	<div class="place-content-between flex flex-col flex-1 card">
		<div>
			<slot name="title"></slot>
		</div>
		<div>
			<slot name="body"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

})
</script>

<style lang="scss">
.card{
	background: $bg--lg-color;
	width: 131px;
	height: 131px;
	border-radius: 25px;
}
</style>
