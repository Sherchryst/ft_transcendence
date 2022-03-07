<template>
    <router-link :to="{ name: 'unique-chat', params: { id: id }}" class="chat-preview flex flex-row items-center py-3 px-7 my-2">
      <div v-if="!isChannel" class="mr-5">
          <img class="h-16 w-16" src="../assets/logo.png" alt="_profile">
      </div>
      <div class="text-left">
          <p class="username text-lg">Username</p>
          <p class="last-message font-thin text-xs">last message</p>
      </div>
    </router-link>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    isChannel: {
        type: Boolean ,
        default: false
    },
    id: {
        type: [String, Number],
        default: 0
    }
  }
})

export default class OneButtonLink extends Vue {
	isChannel!: boolean
    id!: number;
}
</script>

<style lang="scss" scoped>
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