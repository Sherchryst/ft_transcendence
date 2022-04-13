<template>
	<div class="level py-4">
		<div class="level-bar relative shadow-xl">
			<div class="progress" v-bind:style = "{'width': pourcent+'%'}"></div>
			<div class="level-number left absolute left-4">{{level}}</div>
			<div class="level-number absolute right-4">{{level + 1}}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
	props: {
		xp: Number,
	},
	computed: {
		level: function () {
			let expe : number = (this.xp ? this.xp : 0);
			if (expe == 0) return 0;
			console.log((Math.sqrt(625 + (100 * expe)) - 50) / 50)
			return parseInt(String((Math.sqrt(625 + (100 * expe)) - 50) / 50));
		},
		pourcent: function() {
			let expe : number = (this.xp ? this.xp : 0);
			if (expe == 0) return 0;
			return ((Math.sqrt(625 + (100 * expe)) - 50) / 50 - Math.floor((Math.sqrt(625 + (100 * expe)) - 50) / 50)) * 100;
		},
	}
});

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
