<template>
	<div id="base" class="grid grid-cols-12 min-h-screen">
		<nav id="nav" class="flex flex-col items-center">
			<div class="mt-10 h-36">
				<img class="h-16 w-16" src="/test.png" alt="profile">
			</div>
			<div class="flex flex-col">
				<nav-button route="/">
					<HomeIcon />
				</nav-button>
				<nav-button route="/game-choice">
					<GameIcon />
				</nav-button>
				<nav-button route="/chat/list">
					<GroupIcon />
				</nav-button>
				<nav-button route="/chat">
					<ChatIcon />
				</nav-button>
			</div>
		</nav>
		<div class="flex flex-col col-span-11 px-16">
			<div class="mt-10 h-36">
				<div class="flex flex-row justify-between justify-items-center h-16">
					<div class="self-center">
						<!-- If connected -->
						<ButtonLink text="Connection" route="/login" /> 
						<!-- <a href="#">connection</a>
						<a href="#">FAQ</a> -->
					</div>
					<div class="flex flex-row justify-between justify-items-center">
						<div class="self-center">
							<one-row-form placeholder="Recherche" action="/">
								<SearchIcon />
							</one-row-form>
							<!-- <OneRowForm action="/" /> -->
						</div>
						<div class="ml-10">
							<Logo />
							<!-- <img alt="Vue logo" src="../assets/ApongUs.svg"> -->
						</div>
					</div>
				</div>
			</div>
			<router-view/>
		</div>
	</div>
</template>

<script lang="ts">
import NavButton from '@/components/NavButton.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import OneRowForm from '@/components/OneRowForm.vue';
import HomeIcon from '@/assets/icon/home.svg';
import ChatIcon from '@/assets/icon/chat.svg';
import GroupIcon from '@/assets/icon/group.svg';
import GameIcon from '@/assets/icon/game.svg';
import SearchIcon from '@/assets/icon/search.svg';
import Logo from '@/assets/ApongUs.svg';

export default {
	components: {
		NavButton,
		ButtonLink,
		OneRowForm,
		HomeIcon,
		ChatIcon,
		GroupIcon,
		GameIcon,
		SearchIcon,
		Logo,
	}
}
</script>

<style lang="scss" scoped>
#nav {
	background: $bg--lg-color;
}
img {
	background: $bg-color;
	border-radius: 12px;
}
</style>