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
	<!-- <form>
		<ModInput name="invition" placeholder="Nickname" class="mobile">Invitation</ModInput>
		<button type="submit">
			Send
		</button>
	</form> -->
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import OneRowForm from "../OneRowForm.vue";
import SendIcon from '@/assets/icon/send.svg';
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
		}
    },
    components: { OneRowForm, SendIcon }
})
</script>