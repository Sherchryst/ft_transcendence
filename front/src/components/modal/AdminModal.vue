<template>
	<Modal :ref="modalId" :id="modalId" @close="close">
		<template v-slot:title>
			<div v-if="moderation == 'ban'">Ban User</div>
			<div v-else-if="moderation == 'mute'">Mute User</div>
		</template>
		<form @submit.prevent="send">
			<ModInput class="mobile mb-5" name="reason" placeholder="Reason" v-model="formData.reason">Reason</ModInput>
			<ModLabel class="mt-5">Duration</ModLabel>
			<div class="flex flex-row">
				<ModInput class="mobile w-32" type="number" v-model="quantity"></ModInput>
				<select class="mx-2 mt-2 pl-2" v-model="unit">
					<option>Minutes</option>
					<option>Hours</option>
				</select>
			</div>
			<ButtonLink class="w-full mt-5">Confirm</ButtonLink>
		</form>
	</Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../Modal.vue";
import ModInput from "../form/ModInput.vue";
import { API } from "@/scripts/auth";
import ButtonLink from "@/components/ButtonLink.vue"
import ModLabel from "../form/ModLabel.vue";

export default defineComponent({
	name:'AdminModal',
	props: {
		channelId: {type: Number, required: true},
		toId: {type: Number, required: true},
		moderation: {type: String, required: true}
	},
	data() {
		return {
			quantity: "5",
			unit: "Hours",
			formData: {
				channelId: this.channelId,
				toId: this.toId,
				reason: "",
				duration: 0,
				moderation: this.moderation
			}
		}
	},
	components: { Modal, ModInput, ButtonLink, ModLabel },
	computed: {
		modalId(): string {
			return ('modal_' + this.moderation)
		},
		calcDuration(): number {
			return (parseInt(this.quantity) * ((this.unit === "Hours") ? 3600000 : 60000) );
		}
	},
	methods: {
		open() : void {
			(this.$refs[this.modalId] as typeof Modal).open()
		},
		close() : void {
			(this.$refs[this.modalId] as typeof Modal).close()
		},
		send() : void {
			this.formData.duration = this.calcDuration
			console.log("send", this.formData)
			API.post("chat/moderation", this.formData).then( () => {
				this.close();
			}).catch((error) => {console.log(error)});
			
		}
	}
})
</script>

<style lang="scss">
$line-widht: 1px;

select{
	border-radius: 10px;
	background: #fff;
	outline: $line-widht $action solid;
}
</style>