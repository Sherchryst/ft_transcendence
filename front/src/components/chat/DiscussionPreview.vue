<template>
    <router-link :to="route" class="chat-preview flex flex-row items-center py-3 px-7 my-2">
        <slot name="image"></slot>
        <div class="text-left">
            <slot></slot>
        </div>
    </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
    name: "DiscussionPreview",
    props: {
      route: Object
    }
})
</script>

<style lang="scss">
.chat-preview{
    transition: background 120ms ease-in;
    cursor: pointer;
    img {
        background: $bg--lg-color;
        border-radius: 50px;
    }
    > div > p {
        color: $action;
    }
    &:hover{
        background: $bg-action;
    }
    &.router-link-exact-active{
        background: $panel-color;
        &> div > p {
            color: $dark-font;
        }
        .username{
            font-weight: bold;
        }
        .last-message{
            display: none;
        }
    }
    border-radius: 16px;
}
</style>