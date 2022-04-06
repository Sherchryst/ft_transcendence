<template>
	<div class="notif-card flex py-3">
		<img class="w-10 h-10" src="@/assets/blank-avatar.jpg" alt="test">
		<div class="w-64 ml-3 flex flex-col">
			<div class="notif-message">
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
	computed: {
		relativeTime(): string {
			return moment(this.dateTime).fromNow()
		}
	},
	setup(props) {
		props
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