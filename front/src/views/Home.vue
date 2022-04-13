<template>
  <div class="home flex flex-col justify-arround md:grid md:grid-cols-12 gap-8">
      <SquarePanel>
        <div v-for="(match, index) in history" v-bind:key="index">
          <LastGamePanel :match="match"></LastGamePanel>
        </div>
      </SquarePanel>
      <SquarePanel>
        <div class="h-full flex flex-col justify-between">
            <MainTitle>Winrate</MainTitle>
            <div class="text-8xl font-bold pt-5 md:pb-12">{{winrate}}%</div>
        </div>
      </SquarePanel>
      <SquarePanel>
        <div class="flex flex-col gap-3">
            <MainTitle>Top {{topPlayer?.length}}</MainTitle>
            <div class="flex flex-col overflow-auto max-h-52 gap-5">
              <div v-for="(player, index) in topPlayer" :key="index">
                <TopPlayerPanel :player="player" :rank="index + 1"></TopPlayerPanel>
              </div>
            </div>
        </div>
      </SquarePanel>
      <LargePanel>
        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 m-4 gap-4">
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
            <FriendCard></FriendCard>
        </div>
      </LargePanel>
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
import FriendCard from '@/components/home/FriendCard.vue';

export default defineComponent({
    components: {
    SquarePanel,
    LargePanel,
    MainTitle,
    // ButtonLink,
    LastGamePanel,
    TopPlayerPanel,
    FriendCard
},
  data() {
    return {
      winrate: 0,
      history: [],
      topPlayer: [],
    }
  },
  setup () {
    useMeta({ title: 'Home' })
  },
  mounted () {
    console.log('created', this.$store.getters.getId)
    API.get('users/top-ten').then((res) => {
      this.topPlayer = res.data
      console.log(res.data)
    })
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
}

</style>
