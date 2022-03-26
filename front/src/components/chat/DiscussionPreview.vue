<template>
    <router-link :to="{ name: 'unique-chat', params: { id: id }}" class="chat-preview flex flex-row items-center py-3 px-7 my-2">
      <div v-if="!isChannel" class="mr-5">
          <img class="h-16 w-16" src="@/assets/blank-avatar.jpg" alt="_profile">
      </div>
      <div class="text-left">
          <p v-if="isChannel" class="username text-lg">#-{{this.title}}</p>
          <p v-else class="username text-lg">{{this.title}}</p>
          <p class="last-message font-thin text-xs">last message</p>
      </div>
    </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DiscussionPreview",
    props: {
      isChannel: { type: Boolean, default: false },
      id: { type: [String, Number], require: true },
      title: { type: String, default: "Title" },
    }
})
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