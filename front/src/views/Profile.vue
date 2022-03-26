<template>
	<div class="grid grid-cols-12 lg:gap-x-32">
	<!-- <div class="flex flex-col lg:flex-row justify-between sm:flex-wrap"> -->
		<div class="col-span-12 md:col-span-4">
			<div class="flex place-content-center mb-10">
				<ProfilePicture></ProfilePicture>
			</div>
			<div class="mb-16">
				<MainTitle class="title-username">{{ profile.user?.nickname }}</MainTitle>
				<p>{{ profile.user?.login }}</p>
			</div>
			<div class="mb-8">
				<Level text="lvl.8"></Level>
				<LevelBar :percent="68" :level="8" :nextLevel="9"></LevelBar>
			</div>
			<div class="mb-12">
				<ButtonLink v-if="this.username == this.selfLogin" class="flex justify-center w-full" text="Edit Profile"></ButtonLink>
				<div v-else>
					<ButtonLink class="flex justify-center w-full mb-4" text="Ask a friend"></ButtonLink>
					<ButtonLink class="flex justify-center w-full btn-neutral" text="Block User"></ButtonLink>
				</div>

			</div>
			<div class="flex flex-rows justify-around md:flex-wrap">
				<div class="">
					<LittleCard>
						<template v-slot:title>
							<p>Winrate</p>
						</template>
						<template v-slot:body>
							<div class="text-3xl font-bold">89%</div>
						</template>
					</LittleCard>
				</div>
				<div class="">
					<LittleCard>
						<template v-slot:title>
							<p>Played</p>
						</template>
						<template v-slot:body>
							<div class="played text-4xl font-bold italic">
								172
							</div>
						</template>
					</LittleCard>
				</div>
			</div>
		</div>
		<div class="col-span-12 md:col-span-7 flex flex-col">
			<ProfilePanel>
				<template v-slot:title>
					<TitlePanel title="Historique des matchs"> <Scrool/> </TitlePanel>
				</template>
				<template v-slot:body>
					<div class="overflow-auto max-h-64">
						<MatchesHistory :result="true" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
						<MatchesHistory :result="false" type="type of battle" :first="5" :second="3"></MatchesHistory>
					</div>
				</template>
			</ProfilePanel>
			<ProfilePanel>
				<template v-slot:title>
					<TitlePanel title="Achievements"> <Trophy /> </TitlePanel>
				</template>
				<template v-slot:body>
					<div class="grid md:grid-cols-2 max-h-10 gap-x-10 gap-y-5">
						<div>
							<LargerCard></LargerCard>
						</div>
						<div>
							<LargerCard></LargerCard>
						</div>
						<div>
							<LargerCard></LargerCard>
						</div>
						<div>
							<LargerCard></LargerCard>
						</div>
					</div>
				</template>
			</ProfilePanel>
		</div>
	</div>
</template>

<script lang="ts">
import { useMeta } from 'vue-meta'
import ProfilePanel from '@/components/profile/ProfilePanel.vue';
import ProfilePicture from '@/components/profile/ProfilePicture.vue';
import Level from '@/components/profile/Level.vue';
import LevelBar from '@/components/profile/LevelBar.vue';
import MatchesHistory from '@/components/profile/MatchesHistory.vue';
import LittleCard from '@/components/profile/LittleCard.vue';
import LargerCard from '@/components/profile/LargerCard.vue';
import TitlePanel from '@/components/profile/TitlePanel.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import MainTitle from '@/components/MainTitle.vue';
import Scrool from '@/assets/icon/list-game.svg';
import Trophy from '@/assets/icon/achievement.svg';
import {defineComponent, watch, computed} from 'vue';
import { API } from '@/scripts/auth.ts';
import { Profile } from '@/interfaces/Profile';
import { useStore } from 'vuex'
import { key } from '@/store/index.ts'


export default defineComponent({
	name: "Profile",
	components: {
		ProfilePicture,
		MainTitle,
		Level,
		LevelBar,
		ButtonLink,
		LittleCard,
		TitlePanel,
		MatchesHistory,
		Scrool,
		Trophy,
		ProfilePanel,
		LargerCard
	},
	props:
	{
		username: { type: String, required: true}
	},
	setup(props){
		useMeta({ title: 'Profile - ' + props.username})
		const store = useStore(key)

        return {
            selfLogin: computed( () => store.getters.getLogin)
        }
	},
	data() {
		return {
			profile: {} as Profile,
		}
	},
	methods: {
		getUser(username: string | string[]): void {
			API.get('users/get-profile', {
				params: {
					id: null,
					login: username
				}
			})
			.then((res) => {
				this.profile = res.data;
			}).catch((response) => {
				console.error("FAIL GET USER");
			})
		}
	},
	created(): void {
		watch(
			() => this.$route.params,
			(toParams) => {
				this.getUser(toParams.username)
			}
		)
	},
	mounted(): void {
		this.getUser(this.username);
	},
})
</script>

<style lang="scss">
.title{
	&-username{
		color: $action;
	}
}
.played{
	background: $secondary--trans-gradiant;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}
</style>
