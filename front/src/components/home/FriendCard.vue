<template>
    <div class="friend-card grid justify-items-stretch col-span-2">
        <div class="justify-self-center flex flex-col content-center m-5">
            <img class="ring-4 ring-green-300 ring-opacity-90 image h-15 w-15" src="http://localhost:3000/avatars/default.jpg">
        </div>
        <div>
            <p>login</p>
            <p class='pt-2 bold font-medium' style="font-weight: bold;">Nickname</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "FriendCard", 
})
</script>

<style lang="scss" scoped>
.friend-card {
  background-color: white;
  border-radius: 10px;
}
</style>