<template>
	<div class="flex flex-col lg:flex-row justify-between sm:flex-wrap">
		<div>
			<div class="flex place-content-center mb-10">
				<ProfilePicture></ProfilePicture>
			</div>
			<div class="mb-8">
				<MainTitle>{{ profile.user?.nickname }}</MainTitle>
				<p>{{ profile.user?.login }}</p>
			</div>
			<div class="mb-8">
				<Level text="lvl.8"></Level>
				<LevelBar :percent="68" :level="8" :nextLevel="9"></LevelBar>
			</div>
			<div class="mb-12">
				<ButtonLink text="Demander en ami"></ButtonLink>
			</div>
			<div class="flex flex-rows justify-around md:flex-wrap">
				<div class="">
					<LittleCard>
						<template v-slot:title>
							<p>test</p>
						</template>
						<template v-slot:body>
							<p>test</p>
						</template>
					</LittleCard>
				</div>
				<div class="">
					<LittleCard>
						<template v-slot:title>
							<p>test</p>
						</template>
						<template v-slot:body>
							<p>test</p>
						</template>
					</LittleCard>
				</div>
			</div>
		</div>
		<div class="fex flex-col relative">
			<ProfilePanel>
				<template v-slot:title>
					<TitlePanel title="Historique des matchs"> <Scrool></Scrool> </TitlePanel>
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
					<TitlePanel title="Achievements"> <Trophy></Trophy> </TitlePanel>
				</template>
				<template v-slot:body>
					<div class="flex flex-rows flex-wrap max-w-3xl max-h-10">
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
		<div>
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
import Scrool from '@/assets/scroll.svg';
import Trophy from '@/assets/trophy.svg';
import {defineComponent, watch} from 'vue';
import axios from 'axios';
import { Profile } from '@/interfaces/Profile';


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
		console.log(props.username)
		useMeta({ title: 'Profile - ' + props.username})
	},
	data() {
		return {
			profile: {} as Profile,
		}
	},
	methods: {
		getUser(username: string | string[]): void {
			axios.get('http://localhost:3000/users/get-profile-login?username=' + username)
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

</style>
