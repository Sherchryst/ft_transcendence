<template>
    <div>
        <div class="flex flex-col gap-4">
            <div class="text-lg font-bold">{{ user.nickname }}</div>
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
            <button class="text-left" v-if="role=='admin'" @click="mute">
                mute user
            </button>
            <button class="text-left" v-if="role=='admin'" @click="ban">
                ban user
            </button>
            <button v-if="owner && role=='admin'" class="text-left" @click="promote">
                Promote admin
            </button>
            <button v-if="owner && role=='admin'" class="text-left" @click="demote">
                Demote admin
            </button>
        </div>
        <BlockModal ref="modal_block" :user="user"></BlockModal>
        <ChallengeModal ref="modal_challenge" :target="user.nickname" ></ChallengeModal>
        <AdminModal ref="modal_ban" :channelId="channelId" :toId="user.id" moderation="ban"></AdminModal>
        <AdminModal ref="modal_mute" :channelId="channelId" :toId="user.id" moderation="mute"></AdminModal>
    </div>
</template>

<script lang="ts">
import { User } from '@/interfaces/Profile';
import { defineComponent, PropType } from 'vue';
import BlockModal from '../modal/BlockModal.vue';
import ChallengeModal from '../modal/ChallengeModal.vue';
import { API } from '@/scripts/auth';
import AdminModal from '../modal/AdminModal.vue';
import { ChannelMemberRole } from '@/interfaces/Channel';

export default defineComponent({
    name: "Message",
    props: {
        user: { type: Object as PropType<User>, required: true },
        channelId: { type: Number, required: true },
        role: { type: String as PropType<ChannelMemberRole>, default: 'member'},
        owner: { type: Boolean, default: true }
    },
    methods: {
        requestFriend() {
			API.post('users/send-friend-request', {
				fromId: this.$store.getters.getId,
				toId: this.user.id
			}).then( () => {
				//this.statut = 'WAIT'
			})
        },
        block(): void {
            (this.$refs["modal_block"] as typeof BlockModal).open();
        },
        challenge() {
            (this.$refs["modal_challenge"] as typeof ChallengeModal).open()
        },
        mute() {
            (this.$refs["modal_mute"] as typeof AdminModal).open()
            // API.post("chat/moderation", {channelId: this.channelId, toId: this.user.id, reason: null, duration: null, moderation: 'mute'})
        },
        ban() {
            (this.$refs["modal_ban"] as typeof AdminModal).open()
            // API.post("chat/moderation", {channelId: this.channelId, toId: this.user.id, reason: null, duration: null, moderation: 'ban'})
        },
        promote() {
            API.post('chat/promote', {channelId: this.channelId, targetId: this.user.id})
        },
        demote() {
            API.post('chat/demote', {channelId: this.channelId, targetId: this.user.id})
        }
    },
    components: { BlockModal, ChallengeModal, AdminModal }
})
</script>