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

export default {
    components: {
      HelloWorld,
      LogInOut
  },
}
</script>
