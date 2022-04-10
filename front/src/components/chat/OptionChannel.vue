<template>
<div class="flex flex-col gap-4">
	<button @click="leave_channel" class="text-left">
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
	<button @click="openPassword" class="text-left">
		Set password
	</button>
	<PasswordModal ref="password_block" ></PasswordModal>
	<button class="text-left">
		Modify password
	</button>
	<button class="text-left">
		Remove password
	</button>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import OneRowForm from "../OneRowForm.vue";
import SendIcon from '@/assets/icon/send.svg';
import PasswordModal from '@/components/modal/PasswordModal.vue'
import { chatSocket } from "@/socket";
import { Channel } from "@/interfaces/Channel";

export default defineComponent({
    name: "OptionChannelPanel",
	props: {
		channel: {type : Object as PropType<Channel>}
	},
	data() {
		return {
			socket : chatSocket,
		}
	},
    methods: {
        leave_channel(): void {
			this.socket.emit('leave', this.channel?.id);
		},
        invitation(nickname: string) {
			console.log("INVITATION", nickname)
		},
		openPassword() : void {
			(this.$refs['password_block'] as typeof PasswordModal).open()
		},
    },
    components: { OneRowForm, SendIcon, PasswordModal }
})
</script>