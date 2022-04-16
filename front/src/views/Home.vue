<template>
  <div class="home flex flex-col justify-arround md:grid md:grid-cols-12 gap-8">
      <SquarePanel  v-if="history.length != 0">
        <div v-for="(match, index) in history" v-bind:key="index">
          <LastGamePanel :match="match"></LastGamePanel>
        </div>
        <div>
          <p></p>
        </div>
      </SquarePanel>
      <SquarePanel>
        <div class="h-full flex flex-col justify-between">
            <MainTitle>Winrate</MainTitle>
            <div class="text-7xl font-bold pt-5 md:pb-14">{{winrate}}%</div>
        </div>
      </SquarePanel>
      <SquarePanel v-if="topPlayer.length != 0">
        <div class="flex flex-col gap-3">
            <MainTitle>Top {{topPlayer?.length}}</MainTitle>
            <div class="flex flex-col overflow-auto max-h-52 gap-5">
              <div v-for="(player, index) in topPlayer" :key="index">
                <TopPlayerPanel :player="player" :rank="index + 1"></TopPlayerPanel>
              </div>
            </div>
        </div>
      </SquarePanel>
      <LargePanel v-if="friends.length != 0">
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4  p-4">
            <div class=" friend-card" v-for="(friend, index) in friends" :key="index">
              <FriendCard :friend="friend"></FriendCard>
            </div>
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
import LastGamePanel from '@/components/home/LastGamePanel.vue';
import TopPlayerPanel from '@/components/home/TopPlayerPanel.vue';
import { API } from '@/scripts/auth';
import FriendCard from '@/components/home/FriendCard.vue';
import {User} from '@/interfaces/Profile';
import { statusSocket } from '@/socket';

export default defineComponent({
    components: {
    SquarePanel,
    LargePanel,
    MainTitle,
    LastGamePanel,
    TopPlayerPanel,
    FriendCard
},
  data() {
    return {
      winrate: 0,
      history: [],
      topPlayer: [],
      friends: [] as User[],
    }
  },
  watch: {
    friends: {
      handler(newValue: User[]) {
        this.friends = newValue;
        console.log('this change')
      },
      deep: true,
    },
  },
  setup () {
    useMeta({ title: 'Home' })
  },
  mounted () {
    statusSocket.on("status", (data: { userId : number, status : string, message : string}) => {
      data.message = data.message.replace(/<[^>]*>?/gm, '');
      setTimeout(() =>{
        this.friends = this.$store.getters.getFriends
      }, 100)
    })
    this.friends = this.$store.getters.getFriends
    console.log('friends', this.friends);
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
