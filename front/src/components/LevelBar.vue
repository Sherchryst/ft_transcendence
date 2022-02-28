<template>
	<div>
		<ul>
			<li>
				<div class="bar relative shadow-xl">
					<div class="progress" v-bind:style = "{'width':percent+'%'}"></div>
					<div class="percent absolute left-4">{{level}}</div>
					<div class="percent absolute right-4">{{nextLevel}}</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
	percent: Number,
	level: Number,
	nextLevel: Number
  }
})

export default class LevelBar extends Vue {
	percent!: number;
	level!: number;
	nextLevel!: number;
}
</script>

<style lang="scss">
body{
	font-family: sans-serif;
}

*{
	padding: 0;
	margin: 0;
	box-sizing:border-box;
}

ul li{
	list-style-type: none;
	padding:10px;
}

.bar{
	width: 100%;
	background:#dfdfdf;
	overflow: hidden;
	border-radius: 12px;
}

.progress{
	float:left;
	padding:15px;
	background: yellow;
	border-radius: 12px;
}

.percent{
	float: right;
	font-weight: 600;
	height: 30px;
	line-height: 30px;
}
</style>
