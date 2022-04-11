<template>
  <div class="home grid grid-cols-12 gap-8">
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
        <div v-for="(match, index) in history" v-bind:key="index">
          <LastGamePanel :match="match"></LastGamePanel>
        </div>
      </SquarePanel>
      <SquarePanel>
        <div class="h-full flex flex-col justify-between">
            <MainTitle>Winrate</MainTitle>
            <div class="text-8xl font-bold pb-12">{{winrate}}%</div>
        </div>
      </SquarePanel>
      <SquarePanel>
        <div class="h-full flex flex-col justify-between gap-3">
            <MainTitle>Top 10</MainTitle>
            <div class="flex flex-col overflow-auto gap-6">
                <TopPlayerPanel login="login" username="Username" :rank="1"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="2"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="3"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="4"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="5"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="6"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="7"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="8"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="9"></TopPlayerPanel>
                <TopPlayerPanel login="login" username="Username" :rank="10"></TopPlayerPanel>
            </div>
        </div>
      </SquarePanel>
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
import TopPlayerPanel from '@/components/home/TopPlayerPanel.vue';
import { API } from '@/scripts/auth';

export default defineComponent({
    components: {
    SquarePanel,
    LargePanel,
    MainTitle,
    ButtonLink,
    LastGamePanel,
    TopPlayerPanel
},
  data() {
    return {
      winrate: 0,
      history: [],
    }
  },
  setup () {
    useMeta({ title: 'Home' })
  },
  mounted () {
    console.log('created', this.$store.getters.getId)
    API.get('match/get-winrate', {
      params: {
        userId: this.$store.getters.getId
      }
    }).then((res) => {
      this.winrate = parseInt(res.data.winrate) ;
      console.log('Winrate',this.winrate)
    }).catch((err) => {
      console.log(err)
    })
    API.get('match/get-history', {
      params: {
        userId: this.$store.getters.getId,
        limit: 1
      }
    }).then((res) => {
      this.history = res.data;
      console.log('Matches' ,res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
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
