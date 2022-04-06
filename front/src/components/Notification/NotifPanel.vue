<template>
	<div class="flex flex-col">
		<div class="flex justify-between">
			<div class="font-bold text-xl mb-5">Notifications</div>
			<router-link to="home">view all</router-link>
		</div>
		<NotifCard v-for="notification in notifications" :key="notification.date.toString()" :dateTime="notification.date">
			<component :is="notification.container" :data="notification.content"></component>
		</NotifCard>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NotifCard from '@/components/Notification/NotifCard.vue';
import { Notification, FriendRequest, GameInvitation, ChannelInvitation } from "@/interfaces/Notifiaction";
import { User } from "@/interfaces/Profile";
import { API } from "@/scripts/auth";
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
	data() {
		return {
			notifications: [] as Notification[]
		}
	},
	methods: {
		getNotif(): void {
			API.get("/users/get-friend-requests", {
				params: {
					id: this.$store.getters.getId
				}
			}).then( (response) => {
				this.addFriendRequest(response.data[0])
				console.log("RESPONSE :", response.data);
			})

			// TEST
			let user = {
				id: 4,
				login: "lnoirot",
				mmr: 0,
				nickname: "Tor",
				role: "user",
				newUser: false
			} as User
			let channel = {
				id: 3,
				name: "beginner",
				visibility: 1,
				password: "",
			}
			let dateEvent = new Date()
			let gameRequest = { from: user, map: "Andromeda"} as GameInvitation
			let ChannelRequest = { from: user, channel: channel} as ChannelInvitation
			this.notifications.push({
				container: 'NotifChannel',
				content: ChannelRequest,
				date: dateEvent
			} as Notification)
			this.notifications.push({
				container: 'NotifGame',
				content: gameRequest,
				date: dateEvent
			} as Notification)

		},
		addFriendRequest(data: {id: number, nickname: string}): void {
			let friendRequest =  { from: data.nickname} as FriendRequest
			let dateEvent = new Date()
			this.notifications.push({
				container: 'NotifFriend',
				content: friendRequest,
				date: dateEvent
			} as Notification)
		},
	},
	mounted() {
		this.getNotif()
	}
})
</script>