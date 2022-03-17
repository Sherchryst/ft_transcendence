<template>
	<div class="chat grid grid-cols-12 gap-5">
		<div :class="[ hasConv ? 'hidden md:flex' : 'flex' ]" class="col-span-12 md:col-span-4 xl:col-span-3 list flex-col pr-7">
			<h4 class="text-left font-bold text-xl mb-4" >Messages directs</h4>
			<discussion-preview v-for="chan in listDirectMessage" :id="chan.id" :title="chan.name" :key="chan.id" />
			<h4 class="text-left font-bold text-xl mt-4" >Channels</h4>
			<discussion-preview isChannel v-for="chan in listChannel" :id="chan.id" :title="chan.name" :key="chan.id" />
		</div>
		<div :class="[ !hasConv ? 'hidden md:flex' : 'flex' ]" class="col-span-12 md:col-span-8 conversation flex-col justify-center px-3 md:px-7 py-5">
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
import axios from 'axios';
import DiscussionPreview from '@/components/DiscussionPreview.vue'
import { useMeta } from 'vue-meta'



export default defineComponent({
	components: {
		DiscussionPreview,
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
		axios.get('http://localhost:3000/chat/list').then((response) => {
			this.listChannel = response.data
		}).catch((error) => {
			this.listChannel = []
			console.log(error)
		})
	},
})

</script>