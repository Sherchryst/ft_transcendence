<template>
	<single-card-page>
		<div class="mb-20 text-left">
			<main-title class="pb-5">L'experience pong, autrement</main-title>
			<h2 class="font-sans font-bold text-3xl pb-5"></h2>
			<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid ipsum natus doloribus voluptas praesentium, ut quis nam sit, quam adipisci totam repellendus necessitatibus quas unde expedita. Asperiores impedit maxime labore?</p>
		</div>
		<ButtonLink text="Connection avec 42" href="http://localhost:3000/auth/login42" />
		<a clas="cheat mt-2" @click="this.cheat_login">cheat login</a>
	</single-card-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { API } from '@/scripts/auth';
import ButtonLink from '@/components/ButtonLink.vue';
import SingleCardPage from '@/components/SingleCardPage.vue';
import MainTitle from '@/components/MainTitle.vue';
import { useMeta } from 'vue-meta'
import router from '@/router';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'
import { key } from '@/store/index.ts'

export default defineComponent({
	components: {
		ButtonLink,
		SingleCardPage,
		MainTitle
	},
	setup () {
        useMeta({ title: 'Connection' })
    },
	methods: {
		cheat_login(): void {
      API.get('auth/cheat_login').then((response) => {
        console.log(response)
				router.push({name: "home"})
      }).catch((response) => {
        console.log(response)
      })
    },
	},
	created() {
		const route = useRoute()
		const store = useStore(key)

		if (route.query.is2fa !== undefined)
		{
			store.dispatch('connection').then(r => {
				router.push({name: "home"})
			});
		}
	}
})
</script>

<style lang="scss">
.cheat{
	&:hover{
		cursor: pointer;
	}
}
</style>
