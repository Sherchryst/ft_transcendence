<template>
	<div class="flex flex-shrink-0 w-auto h-auto ">
		<img class="frame h-64 w-64" src="../../assets/blank-avatar.jpg" alt="profile">
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

})
</script>

<style lang="scss">
.frame {
  border: 10px solid ;
  margin: auto;
  // padding: 15px 25px;
  border-radius: 94px;
  filter: drop-shadow(0px 4px 4px rgba(7, 53, 70, 0.22));
}
</style>
