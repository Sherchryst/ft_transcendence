<template>
	<div id="base" class="grid grid-cols-12 min-h-screen">
		<nav id="nav" class="flex flex-col lg:items-center lg:fixed h-full w-full lg:w-28 pt-24 lg:pt-0 dropdown-link-container">
			<div class="mb-5 lg:mb-0 lg:pt-10 lg:h-36">
				<nav-button text="Profile" :route="{name: 'profile', params: {username: whoiam}}">
					<CrewMateIcon/>
				</nav-button>
			</div>
			<!-- <one-row-form class="lg:hidden mb-6 mobile" v-model="search_expr" placeholder="Search" @change="search">
				<SearchIcon />
			</one-row-form> -->
			<div class="flex flex-col w-full lg:w-min">
				<nav-button text="Home" :route="{name: 'home'}">
					<HomeIcon />
				</nav-button>
				<nav-button text="Game" :route="{name: 'game-choice'}">
					<GameIcon />
				</nav-button>
				<nav-button text="Channels" :route="{name: 'channel'}">
					<GroupIcon />
				</nav-button>
				<nav-button text="Chat" :route="{name: 'chat'}" class="chat-link">
					<ChatIcon />
				</nav-button>
				<ButtonLink @click="logout()" class="btn-neutral lg:hidden" text="Disconnect" />
			</div>
		</nav>
		<div class="flex flex-col col-span-12 lg:col-start-2 lg:col-span-11 px-4 lg:px-16">
			<div class="lg:pt-10 lg:h-36 my-5 lg:my-0">
				<div class="flex flex-row justify-between h-16">
					<div class="hidden lg:flex self-center">
						<ButtonLink @click="logout()" class="btn-neutral" text="Disconnect" />
					</div>
					<div class="flex flex-row justify-between w-full lg:w-min">
						<div class="hidden lg:flex flex-row justify-between justify-items-center">
							<div class="self-center">
								<OneRowForm placeholder="Search" @callback="search">
									<SearchIcon />
								</OneRowForm>
								
							</div>
						</div>
						<div class="flex flex-row items-center lg:mx-5">
							<button v-s-dropdown-toggle:notification>
								<NotifIcon class="h-12 w-12" />
							</button>
							<BadgeNotif :number="notifications.length"></BadgeNotif>
							<s-dropdown name="notification" align="left" position="bottom">
								<NotifPanel :notifications="notifications" @close="removeNotif"/>
							</s-dropdown>
						</div>
						<div class="">
							<Logo />
						</div>
						<div class="flex flex-row justify-between lg:hidden mobile-dropdown mt-3 mb-10">
							<button @click="toggle_nav()" class="mobile-dropdown-toggle w-10" aria-hidden="true">
								<MenuIcon />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="">
				<router-view/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavButton from '@/components/NavButton.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import OneRowForm from '@/components/OneRowForm.vue';
import HomeIcon from '@/assets/icon/home.svg';
import ChatIcon from '@/assets/icon/chat.svg';
import GroupIcon from '@/assets/icon/group.svg';
import GameIcon from '@/assets/icon/game.svg';
import SearchIcon from '@/assets/icon/search.svg';
import MenuIcon from '@/assets/icon/menu.svg'
import NotifIcon from '@/assets/icon/notification.svg';
import CrewMateIcon from '@/assets/icon/crewmate.svg'
import Logo from '@/assets/ApongUs.svg';
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { API } from '@/scripts/auth';
import router from '@/router';
import { chatSocket, gameSocket, statusSocket } from '@/socket'
import NotifPanel from '@/components/Notification/NotifPanel.vue';
import { Statut } from '@/interfaces/Profile';
import BadgeNotif from '@/components/Notification/BadgeNotif.vue'; 
import { Notification, FriendRequest, GameStart, GameInvitation, ChannelInvitation } from "@/interfaces/Notification";
import { useToast } from "vue-toastification";

export default defineComponent({
	components: {
		NavButton,
		ButtonLink,
		OneRowForm,
		HomeIcon,
		ChatIcon,
		GroupIcon,
		GameIcon,
		SearchIcon,
		MenuIcon,
		Logo,
		NotifIcon,
		CrewMateIcon,
		NotifPanel,
		BadgeNotif
	},
	data() {
		return {
			chatSocket : chatSocket,
			gameSocket : gameSocket,
			statusSocket : statusSocket,
			notifications: [] as Notification[],
			search_expr: "",
			avatarPath: '',
			componentKey: 0,
		}
	},
	mounted() {
		const toast = useToast();
		gameSocket.on("error", (err : string) => {
			toast.error(err);
		})
		chatSocket.on("error", (err : string) => {
			toast.error(err);
		})
		gameSocket.on("warning", (err : string) => {
			toast.warning(err);
		})
		statusSocket.on("new_friend", () => {
			this.$store.dispatch('connection')
		})
		statusSocket.on("status", (data: { userId : number, status : string, message : string}) => {
			this.$store.dispatch("setStatus", {
				userId: data.userId,
				status: data.status,
				message: data.message
			})
		})
		this.avatarPath = this.$store.getters.getAvatarPath;
		this.getNotif()
		this.chatSocket
			.on('invited', (data: ChannelInvitation) => {
				this.addChannelInivtation(data);
			})
		this.gameSocket
			.on('invited', (data: GameInvitation) => {
				this.addGameInvitation(data)
			})
			.on('gameStart', (data: number) => {
				router.push({name: 'game', params: {match_id: data}})
			})
		this.statusSocket
			.on('friend-request', (request: FriendRequest) => {
				console.log(request)
				this.addFriendRequest(request);
			})
	},
	methods: {
		toggle_nav(): void {
			let navElement = document.getElementById("nav");

			if (navElement != null)
				navElement.classList.toggle("dropdown-opened");
		},
		logout(): void {
			API.post('auth/logout').then( () => {
				localStorage.setItem("state", Statut.NOTLOGIN.toString())
				localStorage.removeItem('user')
				router.push({name: "login"})
			}).catch( () => {
				//console.log(err)
			})
		},
		getNotif(): void {
			API.get("/users/get-friend-requests", {
				params: {
					id: this.$store.getters.getId
				}
			}).then( (response) => {
				response.data.forEach( (element: FriendRequest) => {
					this.addFriendRequest(element)
				});
			}).catch( () => {
				//console.log(err)
			})
			API.get('chat/invite-list', {
				params: {
					id: this.$store.getters.getId
				}
			}).then( (response) => {
				response.data.forEach( (element: ChannelInvitation) => {
					this.addChannelInivtation(element)
				})
			}).catch( () => {
				//console.log(err)
			})
		},
		addFriendRequest(data: FriendRequest): void {
			this.notifications.push({
				container: 'NotifFriend',
				content: data,
				date: new Date(data.created_at)
			} as Notification)
		},
		addGameInvitation(data: GameInvitation): void {
			this.notifications.push({
				container: 'NotifGame',
				content: data,
				date: new Date(data.sentAt)
			} as Notification)
		},
		addChannelInivtation(data: ChannelInvitation){
			this.notifications.push({
				container: 'NotifChannel',
				content: data,
				date: new Date(data.sent_at)
			})
		},
		addGameStart(data: string): void {
			let gameStart = JSON.parse(data) as GameStart
			let dateEvent = new Date()
			this.notifications.push({
				container: 'NotifGameStart',
				content: gameStart,
				date: dateEvent
			} as Notification)
		},
		removeNotif(data: any): void {
			let index = this.notifications.findIndex( (notif) => {
				return (notif.content == data)
			})
			this.notifications.splice(index, 1)
		},
		search(expr: string): void {
			if (expr && expr.length)
				router.push({name: 'search', params: {expr: expr}});
		}
	},
	computed: {
		whoiam() : string {
			const store = useStore(key)
			return store.getters.getLogin || 'unknown'
		},
	}
})
</script>

<style lang="scss" scoped>
#nav {
	background: $bg--lg-color;
}
img {
	background: $bg-color;
	border-radius: 12px;
}
.mobile-dropdown-toggle {
	display: none;
	svg {
		pointer-events: none;
	}
}

@media (max-width: 1024px) {
	nav {
		&.dropdown{
			&-link-container{
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				padding-left: 7vw;
				padding-right: 7vw;
				transform: translateY(-100%);
				transition: transform 0.2s, opacity 0.2s;
				z-index: 100;
				&.dropdown-opened{
					opacity: 1;
					transform: translateY(0);
				}
			}
		}
	}
	.mobile-dropdown{
		z-index: 101;
		position: relative;
		&-toggle{
			display: initial;
		}
	}
}
</style>