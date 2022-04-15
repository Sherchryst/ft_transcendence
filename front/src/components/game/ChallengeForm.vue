<template>
	<form class="flex flex-col mb-3" @submit.prevent="print">
		<div v-if="!target" class="flex flex-col-reverse mt-4">
			<ModInput name="username" placeholder="Username" v-model="formData.login" class="mobile" required>Username</ModInput>
		</div>
		<div v-else>
			<div class="mod-input input-lock flex flex-col justify-start">
				<ModLabel name="name">Username</ModLabel>
				<div class="input-div flex flex-shrink">
					<p class="m-2 w-full">{{target}}</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col items-start mt-10">
			<ModLabel name="map">Map</ModLabel>
			<div class="grid grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
				<big-radio-button class="map-1" id="1" checked  @minput="setMap"/>
				<big-radio-button class="map-2" id="2" @minput="setMap"/>
				<big-radio-button class="map-3" id="3" @minput="setMap"/>
			</div>
		</div>
		<div class="flex flex-col items-start mt-10 mb-10">
			<ModLabel name="bonus">Easy</ModLabel>
			<switch-button @change="toggleOption" />
		</div>
		<ButtonLink >Send</ButtonLink>
	</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SwitchButton from '@/components/SwitchButton.vue'
import BigRadioButton from '@/components/BigRadioButton.vue'
import ModInput from '@/components/form/ModInput.vue'
import ModLabel from '@/components/form/ModLabel.vue'
import ButtonLink from '@/components/ButtonLink.vue'
import { gameSocket } from '@/socket'

export default defineComponent({
	name:'ChallengeForm',
	props: {
		target: String
	},
	data() {
		return {
			userSet: false,
			formData: {
				login: "",
				mapId: 1,
				level: 1
			}
		}
	},
	methods: {
		print(){
			console.log("FormData", this.formData)
			gameSocket.emit("invite", this.formData);
		},
		toggleOption(){
			this.formData.level = !(this.formData.level == 1) ? 2 : 1;
		},
		setMap(map: string) {
			this.formData.mapId = parseInt(map)
		}
	},
	components: { SwitchButton, BigRadioButton, ModInput, ModLabel, ButtonLink},
	created() {
		if (this.target)
			this.formData.login = this.target
	}
})
</script>

