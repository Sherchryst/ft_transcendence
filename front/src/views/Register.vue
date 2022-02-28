<template>
	<single-card-page>
	<form>
		<div class="flex flex-col justify-evenly">
			<div class="self-center">
				<ChooseAvatar></ChooseAvatar>
			</div>
			<div class="self-center">
				<br><br>
			</div>
			<div class="self-center">
				<label for="username">Enter username:</label>
				<br>
				<input type="text" class="input" id="username" name="username" placeholder="username" required>
			</div>
			<div class="self-center">
				<br>
			</div>
			<div class="self-center">
				<button type="submit" class="button px-7 py-3 pb-2"> Register </button>
			</div>
		</div>
	</form>
	</single-card-page>
</template>

<script lang="ts">
import ChooseAvatar from '@/components/ChooseAvatar.vue';
import SingleCardPage from '@/components/SingleCardPage.vue';
import { useMeta } from 'vue-meta'

export default {
	components: {
		ChooseAvatar,
		SingleCardPage
	},
	setup () {
        useMeta({ title: 'Création du compte' })
    },
}
</script>

<style lang="scss" scoped>
.button{
	color: $action;
	background: $bg-action;
	border-radius: 10px;
}

.input{
	border-style: solid;
	border-width: 2px;
	border-radius: 8px;
	border-color: $bg-action;
	padding: 10px;
}

</style>
