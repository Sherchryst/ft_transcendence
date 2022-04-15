<template>
	<single-card-page>
	<form @submit.prevent="send">
		<div class="flex flex-col justify-evenly">
			<div class="self-center mb-16">
				<main-title class="pb-16">Registration</main-title>
				<ChooseAvatar @onInputImage="inputImage($event)">
					<template v-slot:activator>
						<div v-if="inside" class="grey frame flex flex-col place-content-center w-64 h-64 mb-10">
							<span class="title-username">Click to add avatar</span>
						</div>
						<div v-else class="flex place-content-center">
							<ProfilePicture :avatar="imageURL"></ProfilePicture>
						</div>
					</template>
				</ChooseAvatar>
			</div>
			<div class="flex flex-col place-content-center mb-12 space-y-4">
				<ModInput name="nickname" class="mobile" placeholder="Username" v-model="nickname">Choose an Username</ModInput>
				<!-- <label for="username">Enter username:</label>
				<input type="text" class="input" id="username" name="username"  placeholder="username" required> -->
			</div>
			<div class="self-center w-full">
				<ButtonLink class="flex justify-center w-full">Register</ButtonLink>
				<!-- <button type="submit" class="button px-7 py-3 pb-2"> Register </button> -->
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
import ProfilePicture from '@/components/profile/ProfilePicture.vue';
import ModInput from '@/components/form/ModInput.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import MainTitle from '@/components/MainTitle.vue';

export default defineComponent({
	components: {
    ChooseAvatar,
    SingleCardPage,
    ProfilePicture,
    ModInput,
    ButtonLink,
	MainTitle
},
	setup () {
		useMeta({ title: 'Création du compte' })
	},
	data() {
		return {
			avatar: {} as File,
			imageURL: '',
			nickname: '',
			inside: true
		}
	},
	methods: {
		inputImage(image: File) {
			this.avatar = image;
			this.imageURL = URL.createObjectURL(image);
			this.inside = false;
		},
		send() {
			var formData = new FormData();
			formData.append('file', this.avatar);
			formData.append('id', this.$store.getters.getId);
			if (this.avatar.size > 0)
				API.post('users/update-avatar', formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}}).catch(err => {
						console.log(err);
						this.$store.commit('setError', err.response.data.message);
					})
			API.post('users/update-nickname', {
				id: this.$store.getters.getId,
				nickname: this.nickname
			}).then( () => {
					this.$store.dispatch('connection').then( () => {
						router.push({name: "home"})
					}).catch(function(error) {
					console.log("update failed", error);
					})
				}).catch(function(error) {
				console.log(error);
			});
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
