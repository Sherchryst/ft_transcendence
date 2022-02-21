<template>
  <div class="chat-preview flex flex-row items-center py-3 px-7 my-2">
      <div v-if="!isChannel" class="mr-5">
          <img class="h-16 w-16" src="/" alt="_profile">
      </div>
      <div class="text-left">
          <p class="">Username</p>
          <p class="font-thin text-xs">last message</p>
      </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    isChannel: {
        type: Boolean ,
        default: false
    }
  }
})

export default class OneButtonLink extends Vue {
	isChannel!: boolean
}
</script>

<style lang="scss" scoped>
.chat-preview{
    transition: background 300ms ease-in;
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
    &.active{
        background: $action;
    }
    border-radius: 16px;
}
</style>