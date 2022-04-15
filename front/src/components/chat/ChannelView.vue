<template>
	<div>
		<div class="chan flex flex-row justify-between px-4 py-3">
				<div class="flex flex-col items-start">
					<span class="title font-bold text-xl">#-{{channel?.name}}</span>
					<span class="font-light">Username</span>
				</div>
				<button @click="join">join</button>
		</div>
		<ChannelModal v-if="channel.password" :channel-id="channel.id" :ref="index"></ChannelModal>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Channel } from '@/interfaces/Channel';
import { API } from '@/scripts/auth';
import ChannelModal from '@/components/modal/ChannelModal.vue';
import { chatSocket } from '@/socket';
import router from '@/router';

export default defineComponent({
	props: {
		channel: {type: Object as PropType<Channel>, required: true},
	},
	data() {
		return {
			socket : chatSocket,
		}
	},
	computed: {
		index(): string{
			return ('channel_block' + this.channel.id)
		}
	},
	methods: {
		open() : void {
			(this.$refs[this.index] as typeof ChannelModal).open()
		},
		join() {
			if (this.channel.password){
				this.open()
			}
			API.post("chat/join", {
				channelId: this.channel?.id,
				password: ""
			}).then((res)=>{
				console.log(res);
				router.push({ name: 'unique-chat', params: { id: this.channel?.id }});
			}).catch((error) => {console.log(error)})
		}
	},
	components: {ChannelModal, }
})
</script>

<style lang="scss" scoped>
.chan{
    border-radius: 12px;
    .title{
        color: $dark-font;
    }
    &:hover{
        background: $panel-color;
    }
}
</style>