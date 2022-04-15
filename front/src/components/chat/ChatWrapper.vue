<template>
	<div class="chat grid grid-cols-12 gap-5">
		<div :class="[ hasConv ? 'hidden md:flex' : 'flex' ]" class="col-span-12 md:col-span-4 xl:col-span-3 list flex-col pr-7">
			<title-count :lenght="listDirectMessage.length" class="mt-4">
				<h4 class="text-left font-bold text-xl mb-4" >Direct Messages</h4>
			</title-count>
			<div v-if="listDirectMessage.length">
				<discussion-preview v-for="chan in listDirectMessage" :id="chan.id" :title="chan.name" :key="chan.id" />
			</div>
			<div v-else>
				<ButtonLink class="my-3">New conversation</ButtonLink>
			</div>
			<title-count :lenght="listChannel.length" class="mt-4">
				<h4 class="text-left font-bold text-xl" >Channels</h4>
			</title-count>
			<discussion-preview isChannel v-for="chan in listChannel" :id="chan.id" :title="chan.name" :key="chan.id" />
		</div>
		<div :class="[ !hasConv ? 'hidden md:flex' : 'flex' ]" class="col-span-12 md:col-span-7 2xl:col-span-6 conversation flex-col justify-center px-3 md:px-7 py-5">
			<slot></slot>
		</div>
  </div>
</template>

<style lang="scss" scoped>
.chat{
	> div{
		
	}
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
import ButtonLink from '@/components/ButtonLink.vue'
import TitleCount from '@/components/common/TitleCount.vue'

export default defineComponent({
	components: {
		DiscussionPreview,
		ButtonLink,
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
			listDirectMessage: [],
            listChannel: [],
        }
    },
	mounted() {
		API.get('chat/join-list').then((response) => {
			this.listChannel = response.data
		}).catch((error) => {
			this.listChannel = []
			console.log(error)
		})
	},
})

</script>