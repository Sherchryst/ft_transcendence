<template>
	<div>
		<vue-avatar @finished="saveClicked" :width="220" :height="220" border="2" style=""> </vue-avatar>
		<img ref="image">
	</div>
</template>

<script>
import {VueAvatar} from 'vue-avatar-editor-improved'

export default {
	components: {
		VueAvatar
	}
};
</script>
