<template>
	<router-link v-if="route" :to="{name: route}" class="btn px-7 py-3 pb-2">{{ text }}</router-link>
	<a v-else-if="text" :href="href" class="btn px-7 py-3 pb-2">{{ text }}</a>
	<button v-else class="btn px-7 py-2 pb-1">
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: "ButtonLink",
	props: {
		text: { type: String },
		route: { type: String },
		href: { type: String }
	}
})
</script>

<style lang="scss" scoped>
button, a, .btn{
	color: white;
	background: $action;
	border-radius: 10px;
	cursor: pointer;
	box-shadow: 0px 4px 4px rgba(142, 172, 171, 0.31);
	transition: 200ms all ease-in;
	&:hover{
		background: $dark-font;
		// transform: translatey(-2px);
		// outline: 0.1em solid $action;
	}
}

.btn{
	&-neutral{
		color: $dark-font;
		background: #dfdfdf;
		&:hover{
			background: darken($color: #dfdfdf, $amount: 5%);
		}
	}
	&-used{
		background: $dark-font;
	}
	&-danger{
		color:white;
		background: $defeat-color;
		&:hover{
			background: darken($color: $defeat-color, $amount: 15%);
		}
	}
	&-inactive{
		cursor: unset;
		background: #dfdfdf;
		color: lighten($color: $dark-font, $amount: 60%);
		&:hover{
			background: #dfdfdf;
			color: lighten($color: $dark-font, $amount: 60%);
		}
	}
}

</style>