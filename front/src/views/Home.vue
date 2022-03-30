<template>
  <div class="home grid grid-cols-12 gap-8">
      <MainTitle>Dashboard</MainTitle>
      <LargePanel>
            <template v-slot:left>
                <div class="flex flex-col justify-between p-7 h-full">
                    <div>
                        <p class="text-left">Pong is one of the first computer games that ever created, this simple "tennis like" game features two paddles and a ball, the goal is to defeat your opponent ...</p>
                    </div>
                    <button-link text="Go faire un PONG" href="http://localhost:8080/#/game"/>
                </div>
            </template>
            <template v-slot:right>
                <div class="h-full w-full panel-dk item-center">
                    <img class="" src="@/assets/boule.gif" alt="Upon Us">
                </div>
            </template>
      </LargePanel>
      <SquarePanel>
          <LastGamePanel login="login" username="User" :first="1" :second="3" :result="false"></LastGamePanel>
      </SquarePanel>
      <SquarePanel>
        <MainTitle>Winrate</MainTitle>
        <div class="text-3xl font-bold">89%</div>
      </SquarePanel>
      <SquarePanel></SquarePanel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'vue-meta';
import SquarePanel from '@/components/home/SquarePanel.vue';
import LargePanel from '@/components/home/LargePanel.vue';
import MainTitle from '@/components/MainTitle.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import LastGamePanel from '@/components/home/LastGamePanel.vue';

export default defineComponent({
    components: {
    SquarePanel,
    LargePanel,
    MainTitle,
    ButtonLink,
    LastGamePanel
},
  setup () {
    useMeta({ title: 'Home' })
  }
})
</script>

<style lang="scss" scoped>
.panel {
  background-color: $panel-color;
  border-radius: 25px;
  height: 35vh;
}
.panel-dk {
  background-color: $panel--dk-color;
  border-radius: 25px;
  height: 35vh;
}

</style>
