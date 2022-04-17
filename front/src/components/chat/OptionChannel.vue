<template>
<div class="opt flex flex-col gap-4">
	<div v-if="role == 'admin'" class="flex flex-col gap-4">
		<p class="opt-title">Admin</p>
		<button @click="openPassword" class="text-left">
			Set password
		</button>
		<PasswordModal ref="password_block" :channelId="channel.id"></PasswordModal>
	</div>
	<p class="opt-title">Action</p>
	<button @click="leave_channel" class="opt-danger text-left">
		Leave channel
	</button>
	<div>
		<div class="mb-2">Invitation</div>
		<OneRowForm placeholder="Nickname" @callback="invitation" class="mobile">
			<span class="flex flex-row items-center">
				<SendIcon/>
			</span>
		</OneRowForm>
	</div>
	<TitleCount :lenght="members.length"><div class="opt-title">Other Members</div></TitleCount>
	<div class="grid grid-cols-3 gap-3 overflow-auto max-h-24">
		<div  v-for="(user, index) in members" :key="index">
			<ParticipantPreview :user="user"></ParticipantPreview>
		</div>
	</div>
</div>
</template>

<style lang="scss">
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
import { Channel, ChannelMemberRole, Member_t } from "@/interfaces/Channel";
import {API} from '@/scripts/auth';
import router from '@/router';
import ParticipantPreview from '@/components/chat/ParticipantPreview.vue';
import TitleCount from "../common/TitleCount.vue";

export default defineComponent({
    name: "OptionChannelPanel",
	props: {
		channel: {type : Object as PropType<Channel>},
		role: {type : String as PropType<ChannelMemberRole>}
	},
	data() {
		return {
			socket : chatSocket,
			members : [] as Member_t[],
		}
	},
	mounted() {
		API.get('chat/channel-info', {params: {channelId: this.channel?.id}}).then(res => {
			this.members = (res.data.members as Member_t[]).filter(m => m.user.id != this.$store.getters.getId);
		}).catch(() => {
			//console.log(err)
		})
	},
    methods: {
        leave_channel(): void {
            API.post('chat/leave', {channelId: this.channel?.id}).then(() => {
                router.push({name: 'chat'});
            }).catch(() => {
				//console.log(err)
			})
		},
        invitation(nickname: string) {
			API.post('chat/invite', {channelId: this.channel?.id, invitedNick: nickname}).catch(() => {
				//console.log(err)
			})
		},
		openPassword() : void {
			(this.$refs['password_block'] as typeof PasswordModal).open()
		},
    },
    components: { OneRowForm, SendIcon, PasswordModal, ParticipantPreview, TitleCount }
})
</script>