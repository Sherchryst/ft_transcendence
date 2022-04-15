<template>
	<div id="base" class="grid grid-cols-12 min-h-screen">
		<nav id="nav" class="flex flex-col md:items-center md:fixed h-full w-full md:w-28 pt-24 md:pt-0 dropdown-link-container">
			<div class="mb-5 md:mb-0 md:pt-10 md:h-36" :key="componentKey">
				<router-link :to="{name: 'profile', params: {username: whoiam}}">
					<img class="h-16 w-16" :src="'http://localhost:3000/' + avatarPath" alt="profile">
				</router-link>
			</div>
			<one-row-form class="md:hidden mb-6 mobile" placeholder="Search">
				<SearchIcon />
			</one-row-form>
			<div class="flex flex-col w-full md:w-min">
				<nav-button text="Home" route="home">
					<HomeIcon />
				</nav-button>
				<nav-button text="Game" route="game-choice">
					<GameIcon />
				</nav-button>
				<nav-button text="Channels" route="channel">
					<GroupIcon />
				</nav-button>
				<nav-button text="Chat" route="chat" class="chat-link" :notification="newMessage">
					<ChatIcon />
				</nav-button>
			</div>
		</nav>
		<div class="flex flex-col col-span-12 md:col-start-2 md:col-span-11 px-4 md:px-16">
			<div class="md:pt-10 md:h-36 ">
				<div class="flex flex-row justify-between md:hidden mobile-dropdown mt-3 mb-10">
					<div class="">
						<Logo />
					</div>
					<button @click="toggle_nav()" class="mobile-dropdown-toggle w-10" aria-hidden="true">
						<MenuIcon />
					</button>
				</div>
				<div class="hidden sm:flex flex-row justify-between justify-items-center h-16">
					<div class="self-center">
						<ButtonLink @click="logout()" class="btn-neutral" text="Disconnect" />
					</div>
					<div class="flex flex-row justify-between justify-items-center">
						<div class="self-center">
							<one-row-form placeholder="Search">
								<SearchIcon />
							</one-row-form>
						</div>
						<div class="self-center flex mx-7">
							<button v-s-dropdown-toggle:some-dropdown>
								<NotifIcon class="h-12 w-12" />
							</button>
							<BadgeNotif :number="notifications.length"></BadgeNotif>
							<s-dropdown name="some-dropdown" align="left">
								<NotifPanel :notifications="notifications" @close="removeNotif"/>
							</s-dropdown>
						</div>
						<div class="">
							<Logo />
						</div>
					</div>
				</div>
			</div>
			<div class="">
				<router-view @read-message="removeMessageFrom"/>
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
import Logo from '@/assets/ApongUs.svg';
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { API } from '@/scripts/auth';
import router from '@/router';
import { SocketMessage } from '@/interfaces/Message';
import { chatSocket, gameSocket, statusSocket } from '@/socket'
import NotifPanel from '@/components/Notification/NotifPanel.vue';
import { Statut } from '@/interfaces/Profile';
import BadgeNotif from '@/components/Notification/BadgeNotif.vue'; 
import { Notification, FriendRequest, GameStart, GameInvitation } from "@/interfaces/Notification";


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
		NotifPanel,
		BadgeNotif
	},
	data() {
		return {
			chatSocket : chatSocket,
			gameSocket : gameSocket,
			channelMessage: [] as SocketMessage[],
			notifications: [] as Notification[],
			avatarPath: '',
			componentKey: 0,
		}
	},
	watch: {
		avatarPath(newPath: string) {
			this.avatarPath = newPath;
			this.componentKey++;
		}
	},
	mounted() {
		gameSocket.on("error", (err : string) => {
			console.log("Game error :", err);
		})
		gameSocket.on("warning", (err : string) => {
			console.log("Game warning :", err);
		})
		statusSocket.on("update_user", (id : number)=> {
			this.avatarPath = this.$store.getters.getAvatarPath;
			this.componentKey++;
		})
		statusSocket.on("new_friend", (data : number) => {
			console.log('NEW FRIEND IN YOUR LIFE bitch', data);
			this.$store.dispatch('connection')
		})
		statusSocket.on("status", (data: { userId : number, status : string, message : string}) => {
			console.log('status data',data);
			this.$store.dispatch("setStatus", {
				userId: data.userId,
				status: data.status,
				message: data.message
			})
		})
		this.avatarPath = this.$store.getters.getAvatarPath;
		this.getNotif()
		this.chatSocket
			.on('message', (data: {channelMessage: SocketMessage}) => {
				if (data.channelMessage.message.from.login != this.$store.getters.getLogin)
					this.channelMessage.push(data.channelMessage)
			})
		this.gameSocket
			.on('invited', (data: GameInvitation) => {
				this.addGameInvitation(data)
			})
			.on('gameStart', (data: number) => {
				console.log("Game starts" ,data)
				router.push({name: 'game', params: {match_id: data}})
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
			})
		},
		removeMessageFrom(id: number)
		{
			console.log("remove message from ", id);
			for( let i = 0; i < this.channelMessage.length; i++){ 
				if ( this.channelMessage[i].channel.id == id) { 
					this.channelMessage.splice(i, 1); 
					i--; 
				}
			}
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
				console.log("len", this.notifications.length)
			})
		},
		addFriendRequest(data: FriendRequest): void {
			let friendRequest =  { nickname: data.nickname, id: data.id} as FriendRequest
			let dateEvent = new Date()
			this.notifications.push({
				container: 'NotifFriend',
				content: friendRequest,
				date: dateEvent
			} as Notification)
		},
		addGameInvitation(data: GameInvitation): void {
			this.notifications.push({
				container: 'NotifGame',
				content: data,
				date: new Date(data.sentAt)
			} as Notification)
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
			console.log("index", index)
			this.notifications.splice(index)
		}
	},
	computed: {
		whoiam() : string {
			const store = useStore(key)
			return store.getters.getLogin || 'unknown'
		},
		newMessage() : number {
			return this.channelMessage.length
		}
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

@media (max-width: 768px) {
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