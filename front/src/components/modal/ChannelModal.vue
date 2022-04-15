<template>
	<Modal ref="modal" :id="'modal-channel-' + channelId" @close="close">
		<template v-slot:title>
			<slot>Channel invitation</slot>
		</template>
		<form>
			<div class="flex flex-col gap-4">
				<ModInput type="password" class="mobile" v-model="FormData.password">Password</ModInput>
				<ButtonLink @click="update">
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

export default defineComponent({
	name: "ChannelModal",
	props: {
		channelId: {type: Number, required: true}
	},
	data() {
		return {
			FormData: {
				channelId: this.channeId,
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
		update(){
			console.log("password channel")
		}
	}
})
</script>