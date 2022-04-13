<template>
	<div class="flex flex-col gap-4">
		<router-link :to="{name: 'profile', params: { username: user?.login }}">View profile</router-link>
		<button class="text-left" @click="challenge">
			Challenge
		</button>
		<button class="text-left" @click="requestFriend">
			Ask a friend
		</button>
		<button class="text-left" @click="block">
			Block
		</button>
		<button class="text-left" @click="mute">
			mute user
		</button>
		<button class="text-left" @click="ban">
			ban user
		</button>
		<button v-if="owner" class="text-left" @click="promute">
			Promute admin
		</button>
		<BlockModal ref="modal_block" :user="user"></BlockModal>
        <ChallengeModal ref="modal_challenge" :target="user.login" ></ChallengeModal>
	</div>
</template>

<script lang="ts">
import { User } from '@/interfaces/Profile';
import { defineComponent, PropType } from 'vue';
import BlockModal from '../modal/BlockModal.vue';
import ChallengeModal from '../modal/ChallengeModal.vue';

export default defineComponent({
    name: "Message",
    props: {
        user: { type: Object as PropType<User>, required: true },
        channelId: { type: Number, required: true },
        myRole: { type: String, default: "admin" },
        owner: { type: Boolean, default: true }
    },
    created() {
        console.log("User", this.user);
        console.log("Channel", this.channelId);
    },
    methods: {
        requestFriend() {
            console.log("Friend");
        },
        block(): void {
            (this.$refs["modal_block"] as typeof BlockModal).open();
        },
        challenge() {
            (this.$refs["modal_challenge"] as typeof ChallengeModal).open()
        },
        mute() {
            console.log("mute");
        },
        ban() {
            console.log("ban");
        },
        promute() {
            console.log("promute");
        },
    },
    components: { BlockModal, ChallengeModal }
})
</script>