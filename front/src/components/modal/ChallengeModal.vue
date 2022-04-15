<template>
	<Modal ref="modal" id="modal-challange" @close="close">
		<template v-slot:title>
			<slot>Challenge</slot>
		</template>
		<ChallengeForm :target="target"></ChallengeForm>
	</Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Modal from '../Modal.vue';
import ChallengeForm from '../game/ChallengeForm.vue';

export default defineComponent({
	name:"ChallengeModal",
	props: {
		target: {type: String}
	},
	methods: {
		open() : void {
			(this.$refs['modal'] as typeof Modal).open()
		},
		close() : void {
			(this.$refs['modal'] as typeof Modal).close()
		},
	},
	components: {Modal, ChallengeForm}

})
</script>