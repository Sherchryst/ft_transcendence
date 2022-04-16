<template>
	<ChatWrapper hasConv :members="members">
		<div class="flex flex-row justify-between items-center">
			<div><slot name="title">Channel Name</slot></div>
			<div class="flex flex-row">
				<!-- <button v-s-dropdown-toggle:info>
					<info-icon class="h-10"></info-icon>
				</button> -->
				<s-dropdown name="info" align="left">
					<slot name="info"></slot>
				</s-dropdown>
				<button v-s-dropdown-toggle:option-channel>
					<option-icon class="h-10"></option-icon>
				</button>
				<s-dropdown name="option-channel" align="left">
					<slot name="option"></slot>
				</s-dropdown>
			</div>
		</div>
		<div class="flex-auto flex flex-col-reverse mb-5 overflow-x-auto">
			<slot name="messages">
				<div class="flex-grow flex flex-col justify-center">
					<div>
						Type a first message.
					</div>
				</div>
			</slot>
		</div>
		<OneRowForm placeholder="Message" @callback="send">
			<span class="flex flex-row items-center">
				<span class="hidden md:flex pl-2 pr-1">Send</span>
				<SendIcon/>
			</span>
		</OneRowForm>
	</ChatWrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import ChatWrapper from "./ChatWrapper.vue";
import OneRowForm from '@/components/OneRowForm.vue'
import SendIcon from '@/assets/icon/send.svg';
import InfoIcon from '@/assets/icon/info.svg'
import OptionIcon from '@/assets/icon/option.svg'
import {Member_t } from "@/interfaces/Channel";

export default defineComponent({
	name: "ChatViewWrapper",
	components: { OneRowForm, SendIcon, ChatWrapper, OptionIcon },
	methods: {
		send(data: string) {
			this.$emit('callback', data)
		}
	},
	props: {
		members: {
			type: Array as () => Member_t[],
			default: () => []
		}
	}
})
</script>