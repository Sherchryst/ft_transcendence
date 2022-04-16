<template>
	<single-card-page>
		<div v-if="isTwoAf == 'true'">
			<div class="mb-20 text-left">
				<main-title class="pb-5">Two Factor Authentication</main-title>
				<h2 class="font-sans font-bold text-3xl pb-5"></h2>
				<p>Two-factor authentication is enable for your account. Please enter the code from your authentication app</p>
			</div>
			<form @submit.prevent="send_digit_code()">
				<ModInput v-model="digits" class="mb-10 mobile" placeholder="Code">Google Authenticator Code</ModInput>
				<ButtonLink class="w-full">Confirm</ButtonLink>
			</form>
		</div>
		<div v-else-if="isTwoAf == 'false'">
			<div class="mb-20">
				<main-title class="pb-10">Please wait</main-title>
				<img src="@/assets/boule.gif"/>
			</div>
		</div>
		<div v-else class="flex flex-col">
			<div class="mb-20 text-left">
				<main-title class="pb-5">Apong Us</main-title>
				<h2 class="font-sans font-bold text-3xl pb-5"></h2>
				<p>Welcome to Apong Us, a very exclusive website for students of 42. This website was made by asoursou, mbrunel, mchardin, roalvare and sgah. You will play one of the most iconic games of the last century. I hope you're glad to have access to this amazing experience and that you will enjoy the journey. </p>
			</div>
			<ButtonLink text="Connect" href="http://localhost:3000/auth/login42" />
			<a class="cheat mt-2" href="http://localhost:3000/auth/cheat_login">cheat login</a>
		</div>
	</single-card-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ButtonLink from '@/components/ButtonLink.vue';
import SingleCardPage from '@/components/SingleCardPage.vue';
import MainTitle from '@/components/MainTitle.vue';
import { useMeta } from 'vue-meta'
import router from '@/router';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { API } from '@/scripts/auth';
import { Statut } from '@/interfaces/Profile';
import ModInput from '@/components/form/ModInput.vue';

export default defineComponent({
	components: {
    ButtonLink,
    SingleCardPage,
    MainTitle,
    ModInput
},
	data() {
		return {
			twofa: false,
			digits: ""
		}
	},
	setup () {
        useMeta({ title: 'Connection' })
		const route = useRoute()

		return {
			isTwoAf: computed( () => route.query.is2fa || null)
		}
    },
	created() {
		const route = useRoute()
		const store = useStore(key)

		if (route.query.is2fa !== undefined)
		{
			if (route.query.is2fa == "false") {
				this.connection()
			}
			else if (route.query.is2fa == "true") {
				localStorage.setItem("state", Statut.TWOFA.toString())
				this.twofa = true;
			}
		}
	},
	methods: {
		send_digit_code(): void {
			API.post('2fa/authenticate', {twoFactorAuthenticationCode: this.digits})
			.then((response) => {
				this.connection()
				console.log(response.data)
			}).catch( (error) => {
				console.log("ERROR", error.response.data)
				if (error.response && error.response.data.message == "Unauthorized")
					this.handleUnauthorize()
			})
		},
		connection() {
			this.$store.dispatch('connection').then( () => {
				if (this.$store.getters.isNewUser)
					router.push({name: "register"})
				router.push({name: "home"})
			}).catch( () => {
				this.handleUnauthorize()
			})
		},
		handleUnauthorize(){
			this.twofa = false;
			localStorage.setItem("state", Statut.NOTLOGIN.toString())
			router.push({name: "login"})
		}
	}
})
</script>

<style lang="scss" scoped>
a {
	&:hover{
		cursor: pointer;
	}
}
</style>
