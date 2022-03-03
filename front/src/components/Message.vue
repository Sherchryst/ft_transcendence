<template>
    <div class="message flex my-3" v-bind:class="[ side == Side.RIGHT ? 'flex-row-reverse' : 'flex-row' ]">
        <div class="">
            <img class="h-10 w-10" src="/" alt="">
        </div>
         <div class="p-3 max-w-xl" v-bind:class="[ side == Side.RIGHT ? 'text-right mr-3' : 'text-left ml-3' ]" >
             <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

export enum Side {
    LEFT,
    RIGHT
}

@Options({
	props: {
		side: Side
	}
})

export default class Message extends Vue {
	side!: Side
    Side = Side
}
</script>

<style lang="scss" scoped>
.message {
    img {
        background: $bg--lg-color;
        border-radius: 50px;
    }
    .text-left{
        color: $dark-font;
        background: $bg--lg-color;
        border-radius: 0px 10px 10px 10px
    }
    .text-right{
        color: $bg--lg-color;
        background: $action;
        border-radius: 10px 0px 10px 10px
    }
}
</style>