<template>
	<div class="chat grid grid-cols-12 gap-5">
		<div :class="[ hasConv ? 'hidden md:flex' : 'flex' ]" class="col-span-12 md:col-span-4 xl:col-span-3 list flex-col pr-7">
			<title-count :lenght="friends.length" class="mt-4">
				<h4 class="text-left font-bold text-xl mb-4" >Direct Messages</h4>
			</title-count>
			<div v-if="friends.length">
				<discussion-preview v-for="(friend, index) in friends" :route="{name: 'direct-message', params: {userId: friend.id}}" :key="index" >
					<template v-slot:image>
						<div class="mr-5">
							<img class="h-10 w-10" src="@/assets/blank-avatar.jpg" alt="_profile">
						</div>
					</template>
					<p class="username text-lg">{{friend.nickname}}</p>
				</discussion-preview>
			</div>
			<div v-else>
				No direct message.
				<!-- <ButtonLink class="my-3">New conversation</ButtonLink> -->
			</div>
			<title-count :lenght="listChannel.length" class="mt-4">
				<h4 class="text-left font-bold text-xl" >Channels</h4>
			</title-count>
			<discussion-preview v-for="(chan, index) in listChannel" :route="{name: 'unique-chat', params: {id: chan.id}}" :key="index" >
				<p class="username text-lg">#-{{chan.name}}</p>
			</discussion-preview>
		</div>
		<div :class="[ !hasConv ? 'hidden md:flex' : 'flex' ]" class="col-span-12 md:col-span-7 2xl:col-span-6 conversation flex-col justify-center px-3 md:px-7 py-5">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.chat{
	.conversation{
		height: 77vh;
		background: #E2E3F2;
		border-radius: 25px;
	}
	.list{
		// background: $panel-color;
		h4 {
			color: $dark-font;
		}
	}
}
</style>

<script lang="ts">

import { defineComponent } from 'vue';
import { API } from '@/scripts/auth';
import DiscussionPreview from '@/components/chat/DiscussionPreview.vue'
import { useMeta } from 'vue-meta'
import TitleCount from '@/components/common/TitleCount.vue'
import { Profile, User } from '@/interfaces/Profile';
import { Channel } from '@/interfaces/Channel';

export default defineComponent({
	components: {
		DiscussionPreview,
		TitleCount
	},
	props: {
		hasConv: Boolean,
	},
	setup () {
		useMeta({ title: 'Chat' })
	},
	data() {
		return {
			friends: [] as User[],
			listChannel: [] as Channel[],
		}
	},
	computed: {
		// friends(): User[] {
		// 	return (this.$store.getters.getFriends)
		// }
	},
	created() {
		// this.$store.dispatch('connection').then( () => {
		// 	this.friends = this.$store.getters.getFriends
		// })
	},
	mounted() {
		API.get('users/profile').then( (response: {data : Profile} ) => {
			this.friends = response.data.friends
			console.log("Frends", this.friends)
		})
		API.get('chat/join-list').then((response) => {
			this.listChannel = response.data
			console.log("list", this.listChannel)
		}).catch((error) => {
			this.listChannel = []
			console.log(error)
		})
	},
})

</script>