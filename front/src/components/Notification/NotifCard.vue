<template>
	<div class="notif-card flex py-3">
		<img class="w-10 h-10" src="@/assets/blank-avatar.jpg" alt="test">
		<div class="w-64 ml-3 flex flex-col">
			<div class="notif-message">
				<slot></slot>
			</div>
			<div>xx ago</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { User } from '@/interfaces/Profile'

export default defineComponent({
	name: "NotifCard",
	props: {
		dateTime: { type: Date },
		from: {type: Object as PropType<User>},
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
</style>