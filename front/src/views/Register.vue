<template>
	<single-card-page>
	<form @submit.prevent="send">
		<div class="flex flex-col justify-evenly">
			<div class="self-center mb-16">
				<ChooseAvatar></ChooseAvatar>
			</div>

			<div class="self-center mb-12 space-y-4">
				<label for="username">Enter username:</label>
				<input type="text" class="input" id="username" name="username" v-model="nickname" placeholder="username" required>
			</div>

			<div class="self-center">
				<button type="submit" class="button px-7 py-3 pb-2"> Register </button>
			</div>
		</div>
	</form>
	</single-card-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChooseAvatar from '@/components/ChooseAvatar.vue';
import SingleCardPage from '@/components/SingleCardPage.vue';
import { API } from '@/scripts/auth';
import { useMeta } from 'vue-meta';
import router from '@/router';

export default defineComponent({
	components: {
		ChooseAvatar,
		SingleCardPage
	},
	setup () {
		useMeta({ title: 'Création du compte' })
	},
	data() {
		return {
			nickname: ""
		}
	},
	methods: {
		send() {
			console.log("send")
			API.post('users/update-nickname', {
				id: this.$store.getters.getId,
				nickname: this.nickname
			}).then( () => {
				this.$store.dispatch('connection').then( () => {
					router.push({name: "home"})
				})
			}).catch(function(error) {
				console.log(error);
			})
		}
	}
})
</script>

<style lang="scss" scoped>
.button{
	color: $action;
	background: $bg-action;
	border-radius: 10px;
}

.input{
	border-style: solid;
	border-width: 2px;
	border-radius: 8px;
	border-color: $bg-action;
	padding: 10px;
}

</style>
