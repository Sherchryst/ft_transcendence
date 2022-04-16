<template>
	<div class="notif-panel flex flex-col">
		<div class="flex justify-between">
			<div class="font-bold text-xl mb-5">Notifications</div>
		</div>
		<div v-if="notifications.length != 0">
			<NotifCard v-for="(notification, index) in notifications" :key="index" :dateTime="notification.date">
				<component :is="notification.container" :data="notification.content" @close="removeNotif"></component>
			</NotifCard>
		</div>
		<div v-else class="w-64 notif-message">
			No notification
		</div>
	</div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import { defineComponent } from "vue";
import NotifCard from '@/components/Notification/NotifCard.vue';
import NotifFriend from "./NotifFriend.vue";
import NotifGame from "./NotifGame.vue";
import NotifChannel from "./NotifChannel.vue";

export default defineComponent({
	name: 'NotifPanel',
	components: {
		NotifCard,
		NotifFriend,
		NotifGame,
		NotifChannel,
	},
	props: {
		notifications: Array
	},
	methods: {
		removeNotif(data: any): void {
			this.$emit('close', data)
		},
	},
})
</script>
