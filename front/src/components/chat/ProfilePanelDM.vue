<template>
	<router-link :to="{name: 'profile', params: { username: user.login } }" class="flex flex-row items-center">
		<div class="mr-3">
			<img class="rounded-full h-10 w-10" :src="'http://localhost:3000/' + user.avatarPath">
		</div>
		<div>
			<p class="font-bold">{{ user.nickname }}</p>
			<p>{{ user.login }}</p>
		</div>
	</router-link>
</template>

<script lang="ts">
import { User } from "@/interfaces/Profile";
import { defineComponent, PropType } from "vue";

export default defineComponent({
	name: 'ProfilePanelDM',
	props: {
		user: {type: Object as PropType<User>, required: true}
	}
})

</script>