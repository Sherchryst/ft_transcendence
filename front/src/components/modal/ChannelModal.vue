<template>
	<Modal ref="modal" :id="'modal-channel-' + channelId" @close="close">
		<template v-slot:title>
			<slot>Channel invitation</slot>
		</template>
		<form @submit.prevent="send">
			<div class="flex flex-col gap-4">
				<ModInput type="password" class="mobile" placeholder="Password" v-model="formData.password">Enter Password</ModInput>
				<ButtonLink>
					Confirm
				</ButtonLink>
			</div>
		</form>
	</Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../Modal.vue";
import ButtonLink from "../ButtonLink.vue";
import ModInput from "../form/ModInput.vue";
import { API } from '@/scripts/auth';
import router from '@/router';

export default defineComponent({
	name: "ChannelModal",
	props: {
		channelId: {type: Number, required: true}
	},
	data() {
		return {
			formData: {
				channelId: this.channelId,
				password: ""
			}
		}
	},
	components: { Modal, ButtonLink, ModInput },
	methods: {
		open() : void {
			(this.$refs['modal'] as typeof Modal).open()
		},
		close() : void {
			(this.$refs['modal'] as typeof Modal).close()
		},
		send(){
			API.post("chat/join", 
				this.formData
			).then((res)=>{
				router.push({ name: 'unique-chat', params: { id: this.channelId }});
			}).catch((err)=>{
				console.log(err)
			})
		}
	}
})
</script>