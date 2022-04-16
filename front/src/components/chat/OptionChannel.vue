<template>
<div class="opt flex flex-col gap-4">
	<div v-if="role == 'admin'">
	<p class="opt-title">Admin</p>
		<button @click="openPassword" class="text-left">
			Set password
		</button>
		<PasswordModal ref="password_block" :channelId="channel.id"></PasswordModal>
	</div>
	<button @click="leave_channel" class="opt-danger text-left">
		Leave channel
	</button>
	<div>
		<div class="mb-2">Invitation</div>
		<OneRowForm placeholder="Nickname" @callback="invitation" class="mobile">
			<span class="flex flex-row items-center">
				<span class="hidden md:flex pl-2 pr-1">Send</span>
				<SendIcon/>
			</span>
		</OneRowForm>
	</div>
</div>
</template>

<style lang="scss" scoped>
.opt{
	button {
		color: $action;
		&.opt-danger{
			color: $defeat-color;
		}

	}
	&-title{
		color: $dark-font;
		@apply font-bold;
	}
}

</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import OneRowForm from "../OneRowForm.vue";
import SendIcon from '@/assets/icon/send.svg';
import PasswordModal from '@/components/modal/PasswordModal.vue'
import { chatSocket } from "@/socket";
import { Channel, ChannelMemberRole } from "@/interfaces/Channel";
import {API} from '@/scripts/auth.ts';
import router from '@/router';

export default defineComponent({
    name: "OptionChannelPanel",
	props: {
		channel: {type : Object as PropType<Channel>},
		role: {type : String as PropType<ChannelMemberRole>}
	},
	data() {
		return {
			socket : chatSocket,
		}
	},
    methods: {
        leave_channel(): void {
            API.post('chat/leave', {channelId: this.channel?.id}).then((response) => {
                router.push({name: 'chat'});
            }).catch((error) => {console.log(error)})
		},
        invitation(nickname: string) {
			API.post('chat/invite', {channelId: this.channel?.id, invitedNick: nickname})
		},
		openPassword() : void {
			(this.$refs['password_block'] as typeof PasswordModal).open()
		},
    },
    components: { OneRowForm, SendIcon, PasswordModal }
})
</script>