<template>
	<div class="flex flex-col">
		<span class="font-accentuate font-semibold">{{ user.from }}</span> wants to become your friend
		<div class="grid grid-cols-2 gap-3 my-2">
			<ButtonLink @click="accept">Accept</ButtonLink>
			<ButtonLink class="btn-neutral">Decline</ButtonLink>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FriendRequest } from "@/interfaces/Notifiaction";
import ButtonLink from "../ButtonLink.vue";
import { API } from "@/scripts/auth";

export default defineComponent({
	name: "NotifFriend",
	props: {
		data: { type: Object, required: true }
	},
	computed: {
		user(): FriendRequest {
			return (this.data as FriendRequest)
		}
	},
	components: { ButtonLink },
	methods: {
		accept() {
			API.post("users/accept-friend-request", {
				fromId: this.$store.getters.getId,
				toId: this.user.id
			})
		}
	}
})
</script>