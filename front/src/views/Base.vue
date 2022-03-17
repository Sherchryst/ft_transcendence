<template>
	<div id="base" class="grid grid-cols-12 min-h-screen">
		<nav id="nav" class="flex flex-col md:items-center md:fixed h-full w-full md:w-28 pt-24 md:pt-0 dropdown-link-container">
			<div class="mb-5 md:mb-0 md:mt-10 md:h-36">
				<router-link :to="{name: 'profile', params: {username: 'emmou'}}">
					<img class="h-16 w-16" src="../assets/logo.png" alt="profile">
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
				<nav-button text="Chat" route="chat" class="chat-link">
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
						<!-- If connected -->
						<ButtonLink text="Connection" route="login" />
					</div>
					<div class="flex flex-row justify-between justify-items-center">
						<div class="self-center">
							<one-row-form placeholder="Recherche">
								<SearchIcon />
							</one-row-form>
						</div>
						<div class="ml-10">
							<Logo />
						</div>
					</div>
				</div>
			</div>
			<router-view/>
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
import Logo from '@/assets/ApongUs.svg';

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
	},
	methods: {
		toggle_nav(): void {
			let navElement = document.getElementById("nav");

			if (navElement != null)
				navElement.classList.toggle("dropdown-opened");
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
