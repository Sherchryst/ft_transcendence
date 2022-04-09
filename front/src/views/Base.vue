<template>
	<div id="base" class="grid grid-cols-12 min-h-screen">
		<nav id="nav" class="flex flex-col md:items-center md:fixed h-full w-full md:w-28 pt-24 md:pt-0 dropdown-link-container">
			<div class="mb-5 md:mb-0 md:mt-10 md:h-36">
				<router-link :to="{name: 'profile', params: {username: whoiam}}">
					<img class="h-16 w-16" src="../assets/blank-avatar.jpg" alt="profile">
				</router-link>
			</div>
			<one-row-form class="md:hidden mb-6 mobile" placeholder="Recherche">
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
				<nav-button text="Chat" route="chat" class="chat-link" :notification="this.newMessage">
					<ChatIcon />
				</nav-button>
			</div>
		</nav>
		<div class="flex flex-col col-span-12 md:col-start-2 md:col-span-11 px-4 md:px-16">
			<div class="md:mt-10 md:h-36 ">
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
						<ButtonLink @click="logout()" class="btn-neutral" text="Deconnection" />
					</div>
					<div class="flex flex-row justify-between justify-items-center">
						<div class="self-center">
							<one-row-form placeholder="Recherche">
								<SearchIcon />
							</one-row-form>
						</div>
						<div class="self-center mx-7">
							<button v-s-dropdown-toggle:notification>
								<NotifIcon class="h-12 w-12" />
							</button>
							<s-dropdown name="notification" align="left">
								<NotifPanel/>
							</s-dropdown>
						</div>
						<div class="">
							<Logo />
						</div>
					</div>
				</div>
			</div>
			<div class="pb-6">
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
import { key } from '@/store/index.ts'
import { API } from '@/scripts/auth.ts';
import router from '@/router';
import { SocketMessage } from '@/interfaces/Message';
import { chatSocket } from '@/socket.ts'
import NotifPanel from '@/components/Notification/NotifPanel.vue';

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
	},
	data() {
		return {
			socket : chatSocket,
			channelMessage: [] as SocketMessage[]
		}
	},
	mounted() {
		this.socket
			.on('message', (data: {channelMessage: SocketMessage}) => {
				if (data.channelMessage.message.from.login != this.$store.getters.getLogin)
					this.channelMessage.push(data.channelMessage)
			})
	},
	methods: {
		toggle_nav(): void {
			let navElement = document.getElementById("nav");

			if (navElement != null)
				navElement.classList.toggle("dropdown-opened");
		},
		logout(): void {
			API.post('auth/logout')
			sessionStorage.clear()
			localStorage.removeItem('user')
			router.push({name: "login"})
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