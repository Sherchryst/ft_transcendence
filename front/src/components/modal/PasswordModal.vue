<template>
	<Modal ref="modal" id="modal-password-user" @close="close">
		<template v-slot:title>
			<slot>Set Password</slot>
		</template>
		<form @submit.prevent="send">
			<div class="flex flex-col gap-4">
				<ModInput type="password" class="mobile" v-model="FormData.password">Password</ModInput>
				<ButtonLink>
					Send
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
import { API } from "@/scripts/auth";

export default defineComponent({
	name: "PasswordModal",
	data() {
		return {
			FormData: {
				password: ""
			}
		}
	},
	props: {
		channelId: {type: Number, required: true}
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
			API.post('chat/set-password', {channelId: this.channelId, password: this.FormData.password}).then(() => {
			this.close(); }).catch(() => {
				//console.log(err);
			})
		}
	}
})
</script>
