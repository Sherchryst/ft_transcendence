<template>
	<router-link :to="route" class="nav-link h-16 w-16 mb-5">
		<slot></slot>
	</router-link>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
	route: String
  }
})
export default class ButtonLink extends Vue {
  route!: string
}
</script>

<style lang="scss">
.nav-link{
	display: flex;
	border-radius: 12px;
	background: $panel-color;
	box-shadow: 0px 4px 4px rgba(7, 53, 70, 0.22);
	svg {
		fill: white;
	}
	&.router-link-exact-active {
		background: $bg-action;
		box-shadow: 0px 4px 4px rgba(142, 172, 171, 0.31);
		svg {
			fill: $action;
		}
	}
}
</style>