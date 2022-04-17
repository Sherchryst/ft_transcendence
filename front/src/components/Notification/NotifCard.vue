<template>
	<div v-if="display" class="notif-card flex py-3">
		<!-- <img class="w-10 h-10" :src="'http://localhost:3000/' + from.avatarPath" alt="test"> -->
		<div class="w-64 ml-3 flex flex-col">
			<div class="notif-message" @close="hidden">
				<slot></slot>
			</div>
			<div class="relative-time">{{ relativeTime }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { User } from '@/interfaces/Profile'
import moment from 'moment'

export default defineComponent({
	name: "NotifCard",
	props: {
		dateTime: { type: Date },
		from: {type: Object as PropType<User>},
	},
	setup(props) {
		props
	},
	data() {
		return {
			display: true
		}
	},
	computed: {
		relativeTime(): string {
			return moment(this.dateTime).fromNow()
		}
	},
	methods: {
		hidden() {
			this.display = false
		}
	}
})
</script>

<style lang="scss">
.notif{
	&-card{
		img {
			border-radius: 25px;
		}
	}
	&-message{
		color: $text-title;
	}
}
.font-accentuate{
	color: $dark-font;
}
.relative-time{
	color: $text-title;
}
</style>