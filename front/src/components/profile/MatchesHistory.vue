<template>
	<div class="grid grid-cols-4 items-center pb-7">
		<div class="col-span-2 md:col-span-1 text-left flex flex-col">
			<p v-if='userId == match.winner.id' class="victory font-sans font-bold text-3xl">VICTORY</p>
			<p v-else class="defeat font-sans font-bold text-3xl">DEFEAT</p>
			<p class="font-light">{{match.mode}}</p>
		</div>
		<div class="hidden lg:flex col-span-2 md:col-span-1 justify-self-center">
			<div class="flex flex-rows justify-between text-3xl w-32">
				<p v-if="userId == match.player1.id" class="w-10 text-left">{{score1}}</p>
				<p v-else class="w-10 text-left">{{score2}}</p>
				<p class="font-medium">vs</p>
				<p v-if="userId == match.player1.id" class="w-10 text-right">{{score2}}</p>
				<p v-else class="w-10 text-right">{{score1}}</p>
			</div>
		</div>
		<div class="col-span-2 md:col-span-1 text-xl flex flex-rows justify-self-end">
			<p v-if="userId == match.player1.id" class=' pt-3 font-medium'>{{match.player2.nickname}}</p>
			<p v-else class=' pt-3 font-medium'>{{match.player1.nickname}}</p>
			<img v-if="userId == match.player1.id" class="image ml-4 h-14 w-14" :src="'http://localhost:3000/' + match.player2.avatarPath">
			<img v-else class="image ml-4 h-14 w-14" :src="'http://localhost:3000/' + match.player1.avatarPath">
		</div>
		<div class="col-span-2 md:col-span-1 hidden lg:flex flex-col">
			<p>Stadium</p>
			<p>{{date}}</p>
		</div>
	</div>
</template>

<script lang="ts">
import moment from 'moment';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
	match : {
		type: Object,
		required: true,
		default: () => ({}),
	},
	userId : {
		type: Number,
		required: true,
		default: 0,
	},
},
	data() {
		return {
			date: moment(new Date(this.match.endAt)).format('YYYY/MM/DD'),
			score1: String(this.match.score1).padStart(2, " "),
			score2: String(this.match.score2).padStart(2, " "),
		}
	},

})
</script>

<style lang="scss">
.victory{
	color: $victory-color;
}

.defeat{
	color: $defeat-color;
}

.image{
	background-color: lightgrey;
	width: 40px;
	height:40px;
	border-radius: 200px;
}
</style>
