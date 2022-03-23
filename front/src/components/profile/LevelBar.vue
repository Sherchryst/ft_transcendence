<template>
	<div class="level p-4">
		<div class="level-bar relative shadow-xl">
			<div class="progress" v-bind:style = "{'width':percent+'%'}"></div>
			<div class="level-number left absolute left-4">{{level}}</div>
			<div class="level-number absolute right-4">{{nextLevel}}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
	percent: Number,
	level: Number,
	nextLevel: Number
  }
})
</script>

<style lang="scss" scoped>
.level{
	&-bar{
		width: 100%;
		background:#dfdfdf;
		overflow: hidden;
		border-radius: 12px;
		.progress{
			float:left;
			padding:15px;
			background: $secondary-gradiant;
			border-radius: 12px;
		}
	}
	&-number{
		&.left{
			color: white;
		}
		float: right;
		font-weight: 600;
		height: 30px;
		line-height: 30px;
	}
}

</style>
