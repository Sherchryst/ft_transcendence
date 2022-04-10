<template>
	<Modal ref="modal_block" id="modal-block-user" @close="close">
		<template v-slot:title>
			Block User
		</template>
		You will block the user <span class="font-bold">{{ user?.nickname }}</span>. No more of his messages will appear. You could always unblock it later.
		<template v-slot:footer>
			<div class="flex flex-col lg:flex-row gap-4 lg:justify-end">
				<ButtonLink @click="block" class="btn-danger">
					Block
				</ButtonLink>
				<ButtonLink class="btn-neutral" @click="close">
					Cancel
				</ButtonLink>
			</div>
		</template>
	</Modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Modal from "../Modal.vue";
import ButtonLink from "@/components/ButtonLink.vue";
import { API } from '@/scripts/auth';
import { User } from "@/interfaces/Profile";

export default defineComponent({
	name: 'BlockModal',
	props: {
		user: {} as PropType<User>,
	},
	components: { Modal, ButtonLink },
	methods: {
		open() : void {
			(this.$refs['modal_block'] as typeof Modal).open()
		},
		close() : void {
			(this.$refs['modal_block'] as typeof Modal).close()
		},
		block() : void {
			API.post('users/block-user', {
				fromId: this.$store.getters.getId,
				toId: this.user?.id
			}).then( () => {
				this.close()
				this.$emit('block')
			})
		},
	}
})
</script>