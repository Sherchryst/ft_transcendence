<template>
	<router-link @click="toggle_nav()" :to="{name: route}" class="flex flex-row items-center nav-link mb-5">
		<div class="flex h-14 w-14 md:h-16 md:w-16">
			<slot></slot>
		</div>
		<div class="lg:hidden pl-7 pt-1">{{text}}</div>
		<BadgeNotif :number="notification"></BadgeNotif>
		<!-- <div v-if="notification" class="felx lg:relative">
			<div class="notification px-2 text-sm ml-3 lg:absolute bottom-0 right-0">
				{{ notification }}
			</div>
		</div> -->
	</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BadgeNotif from './Notification/BadgeNotif.vue';

export default defineComponent({
    name: "NavButton",
    props: {
        text: { type: String, default: "link" },
        notification: { type: Number, default: 0 },
        route: String,
    },
    methods: {
        toggle_nav(): void {
            let navElement = document.getElementById("nav");
            if (navElement != null && navElement.classList.contains("dropdown-opened"))
                navElement.classList.toggle("dropdown-opened");
        }
    },
    components: { BadgeNotif }
})
</script>

<style lang="scss">
.nav-link{
	transition: 200ms all;
	display: flex;
	border-radius: 12px;
	// background: $panel-color;
	// box-shadow: 0px 4px 4px rgba(7, 53, 70, 0.22);
	color: $action;
	svg {
		transition: 200ms all;
		fill: $action;
	}
	&:hover{
		background: $bg-action;
		box-shadow: 0px 4px 4px rgba(7, 53, 70, 0.22);
	}
	&.router-link-exact-active, &.chat-link.router-link-active {
		// background: $bg-action;
		// color: $action;
		background: $panel-color;
		color: $dark-font;
		box-shadow: 0px 4px 4px rgba(142, 172, 171, 0.31);
		font-weight: bold;
		svg {
			fill: $dark-font;
		}
	}
}
</style>