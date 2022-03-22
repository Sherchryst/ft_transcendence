<template>
    <div class="message flex my-3" v-bind:class="[ self ? 'flex-row-reverse' : 'flex-row' ]">
        <div class="flex-shrink-0 h-10 w-10">
            <img class="h-10 w-10" src="@/assets/logo.png" alt="">
        </div>
         <div class="p-3 max-w-xl flex-shrink" v-bind:class="[ self ? 'text-right mr-3' : 'text-left ml-3' ]" >
             <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export enum Side {
    LEFT,
    RIGHT
}

export default defineComponent({
    name: "Message",
    props: {
        self: { type: Boolean, required: true }
    }
})
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