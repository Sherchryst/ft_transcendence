<template>
	<form class="flex flex-col" @submit.prevent="print">
		<div v-if="!userSet" class="flex flex-col-reverse mt-4">
			<ModInput name="username" placeholder="Username" v-model="formData.username">Username</ModInput>
		</div>
		<div class="flex flex-col items-start mt-10">
			<span>Maps</span>
			<div class="grid grid-cols-2 gap-4 w-full">
				<big-radio-button id="1" checked  @minput="setMap"/>
				<big-radio-button id="2" @minput="setMap"/>
				<big-radio-button id="3" @minput="setMap"/>
			</div>
		</div>
		<div class="flex flex-col items-start mt-10">
			<span class="mb-1">Bonus</span>
			<switch-button @change="toggleOption" />
		</div>
		<button type="submit">
			Test
		</button>
	</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SwitchButton from '@/components/SwitchButton.vue'
import BigRadioButton from '@/components/BigRadioButton.vue'
import ModInput from '@/components/form/ModInput.vue'

export default defineComponent({
	name:'ChallengeForm',
	props: {
		fill: String
	},
	data() {
		return {
			userSet: false,
			formData: {
				username: "",
				map: "1",
				option: false
			}
		}
	},
	methods: {
		print(){
			console.log("FormData", this.formData)
		},
		toggleOption(){
			this.formData.option = !this.formData.option 
		},
		setMap(map: string) {
			this.formData.map = map
		}
	},
	components: { SwitchButton, BigRadioButton, ModInput }
})
</script>

