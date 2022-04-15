<template>
	<ChatViewWrapper>
		<template v-slot:info>
			
		</template>
		<template v-slot:option>
			
		</template>
		<template v-slot:messages>

		</template>
	</ChatViewWrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatViewWrapper from '@/components/chat/ChatViewWrapper.vue';
import { Message_t } from '@/interfaces/Message';

export default defineComponent({
	name: 'DirectMessage',
	props: {
		userId: {type: String, required: true}
	},
	data() {
		return {
			history: [] as Message_t[],
		}
	},
	components: { ChatViewWrapper}
})
</script>