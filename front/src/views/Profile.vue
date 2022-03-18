<template>
	<div class="flex flex-col lg:flex-row justify-between sm:flex-wrap">
		<div>
			<div class="flex place-content-center">
				<ProfilePicture></ProfilePicture>
			</div>
			<br>

			<MainTitle>{{ profile.user?.nickname }}</MainTitle>
			<p>{{ profile.user?.login }}</p>
			<br><br>
			<Level text="lvl.8"></Level>
			<LevelBar :percent="68" :level="8" :nextLevel="9"></LevelBar>
			<br>
			<ButtonLink text="Demander en ami"></ButtonLink>
			<br><br>
			<div class="flex flex-rows justify-around md:flex-wrap">
				<div class="">
					<LittleCard><p>test</p></LittleCard>
				</div>
				<div class="">
					<LittleCard><p>test</p></LittleCard>
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
import ProfilePicture from '@/components/ProfilePicture.vue';
import MainTitle from '@/components/MainTitle.vue';
import Level from '@/components/Level.vue';
import LevelBar from '@/components/LevelBar.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import LittleCard from '@/components/LittleCard.vue';
import LargerCard from '@/components/LargerCard.vue';
import TitlePanel from '@/components/TitlePanel.vue';
import MatchesHistory from '@/components/MatchesHistory.vue';
import ProfilePanel from '@/components/ProfilePanel.vue';
import Scrool from '@/assets/scroll.svg';
import Trophy from '@/assets/trophy.svg';
import {defineComponent, watch} from 'vue';
import { API } from '@/scripts/auth.ts';
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
			API.get('users/get-profile-login?username=' + username)
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
