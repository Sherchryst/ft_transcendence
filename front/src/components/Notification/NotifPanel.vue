<template>
	<div class="notif-panel flex flex-col">
		<div class="flex justify-between">
			<div class="font-bold text-xl mb-5">Notifications</div>
			<router-link to="home">view all</router-link>
		</div>
		<div v-if="notifications.length != 0">
			<NotifCard v-for="notification in notifications" :key="notification.date.toString()" :dateTime="notification.date">
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
import { Notification, FriendRequest, GameStart } from "@/interfaces/Notification";
// import { GameInvitation, ChannelInvitation } from "@/interfaces/Notification";
// import { User } from "@/interfaces/Profile";
import { API } from "@/scripts/auth";
import NotifFriend from "./NotifFriend.vue";
import NotifGame from "./NotifGame.vue";
import NotifChannel from "./NotifChannel.vue";
import { gameSocket } from "@/socket";

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
			socket: gameSocket,
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
				response.data.forEach( (element: FriendRequest) => {
					this.addFriendRequest(element)
				});
			})

			// TEST
			
			// let user = {
			// 	id: 4,
			// 	login: "lnoirot",
			// 	mmr: 0,
			// 	nickname: "Tor",
			// 	role: "user",
			// 	newUser: false
			// } as User
			// let channel = {
			// 	id: 3,
			// 	name: "beginner",
			// 	visibility: 1,
			// 	password: "",
			// }
			// let dateEvent = new Date()
			// let gameRequest = { from: user, map: "Andromeda"} as GameInvitation
			// let ChannelRequest = { from: user, channel: channel} as ChannelInvitation
			// this.notifications.push({
			// 	container: 'NotifChannel',
			// 	content: ChannelRequest,
			// 	date: dateEvent
			// } as Notification)
			// this.notifications.push({
			// 	container: 'NotifGame',
			// 	content: gameRequest,
			// 	date: dateEvent
			// } as Notification)

		},
		addFriendRequest(data: FriendRequest): void {
			let friendRequest =  { nickname: data.nickname, id: data.id} as FriendRequest
			let dateEvent = new Date()
			this.notifications.push({
				container: 'NotifFriend',
				content: friendRequest,
				date: dateEvent
			} as Notification)
		},
		addGameStart(data: string): void {
			let gameStart = JSON.parse(data) as GameStart
			let dateEvent = new Date()
			this.notifications.push({
				container: 'NotifGameStart',
				content: gameStart,
				date: dateEvent
			} as Notification)
		},
		removeNotif(data: any): void {
			let index = this.notifications.findIndex( (notif) => {
				return (notif.content == data)
			})
			console.log("index", index)
			this.notifications.splice(index)
		}
	},
	created() {
		console.log("NotifPanel created")
	},
	mounted() {
		console.log("NotifPanel mounted")
		this.getNotif()
	}
})
</script>