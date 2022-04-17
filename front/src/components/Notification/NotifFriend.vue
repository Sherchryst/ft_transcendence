<template>
	<div class="flex flex-col">
		<span class="font-accentuate font-semibold">{{ request.from.nickname }}</span> wants to become your friend
		<div class="grid grid-cols-2 gap-3 my-2">
			<ButtonLink @click="accept">Accept</ButtonLink>
			<ButtonLink @click="decline" class="btn-neutral">Decline</ButtonLink>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FriendRequest } from "@/interfaces/Notification";
import ButtonLink from "../ButtonLink.vue";
import { API } from "@/scripts/auth";

export default defineComponent({
	name: "NotifFriend",
	props: {
		data: { type: Object, required: true }
	},
	computed: {
		request(): FriendRequest {
			return (this.data as FriendRequest)
		}
	},
	components: { ButtonLink },
	methods: {
		accept() {
			API.post("users/accept-friend-request", {
				fromId: this.request.from.id,
				toId: this.$store.getters.getId
			}).then( () => {
				this.$store.dispatch("connection");
				this.close()
			}).catch( err => {
				console.log(err)
			})
		},
		decline() {
			API.post("users/decline-friend", {
				fromId: this.request.from.id 
			}).then( () => {
				this.close()
			}).catch( err => {
				console.log(err)
			})
		},
		close(){
			this.$emit("close", this.request)
		}
	}
})
</script>