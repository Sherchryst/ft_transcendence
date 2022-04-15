<template>
	<Modal ref="modal" id="modal-password-user" @close="close">
		<template v-slot:title>
			<slot>Set Password</slot>
		</template>
		<form>
			<div class="flex flex-col gap-4">
				<ModInput type="password" class="mobile" v-model="FormData.password">Password</ModInput>
				<ButtonLink @click="update">
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

export default defineComponent({
	name: "PasswordModal",
	data() {
		return {
			FormData: {
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
			console.log("update")
		}
	}
})
</script>