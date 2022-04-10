<template>
	<div class="grid grid-cols-12 lg:gap-x-16 2xl:gap-x-32">
		<div class="col-span-12 md:col-span-4 flex flex-col max-w-sm">
			<div class="flex place-content-center mb-4">
				<ProfilePicture v-if="profile.user != undefined" :avatar="'http://localhost:3000/' + profile.user?.avatarPath"></ProfilePicture>
			</div>
			<div class="mb-6">
				<MainTitle class="title-username">{{ profile.user?.nickname }}</MainTitle>
				<p>{{ profile.user?.login }}</p>
			</div>
			<div class="mb-8">
				<LevelBar :percent="68" :level="8" :nextLevel="9"></LevelBar>
			</div>
			<div class="mb-12">
				<ButtonLink v-if="username == selfLogin" route="edit-profile" class="flex justify-center w-full"  text="Edit Profile"></ButtonLink>
				<div v-else class="flex flex-col gap-y-4">
					<Transition mode="out-in" name="btn">
						<button-link v-if="statut == 'NONE'" class="flex justify-center w-full" text="Ask a friend" @click="friendRequest"></button-link>
						<button-link v-else-if="statut == 'WAIT'" class="btn-used flex justify-center w-full" text="Friend request send"></button-link>
						<ButtonLink v-else-if="statut == 'BLOCK'" class="flex justify-center w-full" text="Unblock User" @click="unblock"></ButtonLink>
					</Transition>
					<Transition mode="out-in" name="btn">
						<ButtonLink v-if="statut == 'NONE'" class="flex justify-center w-full btn-neutral" text="Block User" @click="openModal"></ButtonLink>
						<ButtonLink v-else-if="statut == 'BLOCK'" class="flex justify-center w-full btn-inactive" text="This User is block"></ButtonLink>
					</Transition>
				</div>
			</div>
			<div class="flex flex-rows justify-around md:flex-wrap">
				<div class="">
					<LittleCard>
						<template v-slot:title>
							<p>Winrate</p>
						</template>
						<template v-slot:body>
							<div class="text-3xl font-bold">{{winrate}}%</div>
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
								{{count}}
							</div>
						</template>
					</LittleCard>
				</div>
			</div>
		</div>
		<div class="col-span-12 lg:col-span-8 2xl:col-span-7 flex flex-col">
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
					<div class="grid md:grid-cols-2 gap-x-10 gap-y-5">
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
							<LargerCard class="lg-card-inactive"></LargerCard>
						</div>
					</div>
				</template>
			</ProfilePanel>
		</div>
		<Modal ref="modal_block" id="modal-block-user" @close="showModal = false">
			<template v-slot:title>
				Block User
			</template>
			You will block the user <span class="font-bold">{{ username }}</span>. No more of his messages will appear. You could always unblock it later on this page.
			<template v-slot:footer>
				<div class="flex flex-col lg:flex-row gap-4 lg:justify-end">
					<ButtonLink @click="block" class="btn-danger">
						Block
					</ButtonLink>
					<ButtonLink class="btn-neutral" @click="closeModal">
						Cancel
					</ButtonLink>
				</div>
			</template>
		</Modal>
	</div>
</template>

<script lang="ts">
import { useMeta } from 'vue-meta'
import ProfilePanel from '@/components/profile/ProfilePanel.vue';
import ProfilePicture from '@/components/profile/ProfilePicture.vue';
import LevelBar from '@/components/profile/LevelBar.vue';
import MatchesHistory from '@/components/profile/MatchesHistory.vue';
import LittleCard from '@/components/profile/LittleCard.vue';
import LargerCard from '@/components/profile/LargerCard.vue';
import TitlePanel from '@/components/profile/TitlePanel.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import MainTitle from '@/components/MainTitle.vue';
import Modal from '@/components/Modal.vue';
import Scrool from '@/assets/icon/list-game.svg';
import Trophy from '@/assets/icon/achievement.svg';
import {defineComponent, watch, computed} from 'vue';
import { API } from '@/scripts/auth';
import { Profile } from '@/interfaces/Profile';
import { useStore } from 'vuex'
import { key } from '@/store/index'
import router from '@/router';


export default defineComponent({
	name: "Profile",
	components: {
		ProfilePicture,
		MainTitle,
		LevelBar,
		ButtonLink,
		LittleCard,
		TitlePanel,
		MatchesHistory,
		Scrool,
		Trophy,
		ProfilePanel,
		LargerCard,
		Modal
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
			showModal: false,
			statut: "NONE",
			count: 0,
			winrate: 0,
			history: []
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
			.then((res: any) => {
				this.profile = res.data;
				API.get('match/match-count', {
					params: {
						id: this.profile.user.id
					}
				}).then((res: any) => {
					this.count = res.data.count;
					console.log('Matches count',this.count)
				}).catch((err: any) => {
					console.log(err)
				})
				API.get('match/get-winrate', {
					params: {
						id: this.profile.user.id
					}
				}).then((res: any) => {
					this.winrate = res.data.winrate;
					console.log('Winrate',this.winrate)
				}).catch((err: any) => {
					console.log(err)
				})
				API.get('match/get-history', {
					params: {
						id: this.profile.user.id,
						limit: 50
					}
				}).then((res: any) => {
					this.history = res.data;
					console.log('Matches' ,res.data)
				}).catch((err: any) => {
					console.log(err)
				})
			}).catch(() => {
				router.push({name: 'not-found'})
			})
		},
		openModal() : void {
			(this.$refs['modal_block'] as typeof Modal).open()
		},
		closeModal() : void {
			(this.$refs['modal_block'] as typeof Modal).close()
		},
		friendRequest() : void {
			API.post('users/send-friend-request', {
				fromId: this.$store.getters.getId,
				toId: this.profile.user?.id
			}).then( () => {
				this.statut = 'WAIT'
			})
		},
		block() : void {
			API.post('users/block-user', {
				fromId: this.$store.getters.getId,
				toId: this.profile.user?.id
			}).then( () => {
				this.statut = 'BLOCK'
				this.closeModal()
			})
		},
		unblock() : void {
			API.post('users/unblock-user', {
				fromId: this.$store.getters.getId,
				toId: this.profile.user?.id
			}).then( () => {
				this.statut = 'NONE'
			})
		},
	},
	created(): void {
		watch(
			() => this.$route.params,
			(toParams) => {
				if(toParams.username)
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

// .btn-enter-active,
// .btn-leave-active {
//   transition: opacity 2s ease;
// }

// .btn-enter-from,
// .btn-leave-to {
// //   color: white;
//   opacity: 0;
// }

// .btn-enter-to,
// .btn-leave-from {
//   color: black;
// }

</style>
