<template>
    <router-link :to="{ name: 'unique-chat', params: { id: id }}" class="chat-preview flex flex-row items-center py-3 px-7 my-2">
      <div v-if="!isChannel" class="mr-5">
          <img class="h-16 w-16" src="/" alt="_profile">
      </div>
      <div class="text-left">
          <p class="">Username</p>
          <p class="font-thin text-xs">last message</p>
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
    transition: background 300ms ease-in;
    cursor: pointer;
    img {
        background: $bg--lg-color;
        border-radius: 50px;
    }
    > div > p {
        color: $bg--lg-color;
    }
    &:hover{
        background: $bg-action;
    }
    &.router-link-exact-active{
        background: $action;
    }
    border-radius: 16px;
}
</style>