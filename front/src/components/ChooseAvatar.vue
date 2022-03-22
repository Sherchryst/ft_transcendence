<template>
	<div>
		<vue-avatar @finished="saveClicked" :width="220" :height="220" border="2" style=""> </vue-avatar>
		<img ref="image">
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import {VueAvatar} from 'vue-avatar-editor-improved'

export default defineComponent({
	components: {
		VueAvatar
	}
});
</script>
