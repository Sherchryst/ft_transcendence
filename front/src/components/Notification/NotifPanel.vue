<template>
	<div class="flex flex-col">
		<div class="flex justify-between">
			<div class="font-bold text-xl mb-5">Notification</div>
			<router-link to="home">view all</router-link>
		</div>
		<NotifCard>
			<span class="font-accentuate font-semibold">Syndraum</span> wants to challenge you on <span class="font-accentuate font-semibold">Pegasus</span>
		</NotifCard>
		<NotifCard>
			<span class="font-accentuate font-semibold">Syndraum</span> has invited you in the channel <span class="font-accentuate font-semibold">#-best-gamer</span>
		</NotifCard>
		<NotifCard>
			<span class="font-accentuate font-semibold">Syndraum</span> wants to become your friend
		</NotifCard>
	</div>
</template>

<script lang="ts">import { defineComponent } from "vue";
import NotifCard from '@/components/Notification/NotifCard.vue';

export default defineComponent({
	name: 'NotifPanel',
	components: {
		NotifCard,
	}
})
</script>