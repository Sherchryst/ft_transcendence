<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Hell"/>
    <LogInOut/>

  </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import LogInOut from '@/components/LogInOut.vue';
import { useMeta } from 'vue-meta'

export default {
    components: {
      HelloWorld,
      LogInOut
  },
  setup () {
    useMeta({ title: 'Home' })
  }
}
</script>
