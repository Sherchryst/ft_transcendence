<template>
	<div class="flex flex-rows justify-evenly flex-wrap md:flex-wrap sm:flex-wrap">
		<div class="fex flex-col">
			<div class="flex place-content-center">
				<ProfilePicture></ProfilePicture>
			</div>
			<br>
			<MainTitle>username</MainTitle>
			<p>login</p>
			<br><br>
			<Level text="lvl.8"></Level>
			<LevelBar percent="68" level="8" nextLevel="9"></LevelBar>
			<br>
			<ButtonLink text="Demander en ami" route="NULL"></ButtonLink>
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
			<TitlePanel title="Historique des matchs"> <img src="../assets/scroll.svg"> </TitlePanel>
			<TitlePanel title="Achievements"> <img src="../assets/trophy.svg"> </TitlePanel>
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
import TitlePanel from '@/components/TitlePanel.vue';

export default {
	components: {
		ProfilePicture,
		MainTitle,
		Level,
		LevelBar,
		ButtonLink,
		LittleCard,
		TitlePanel
	},
	setup () {
        useMeta({ title: 'Profile' })
    },
}
</script>

<style lang="scss">

</style>
