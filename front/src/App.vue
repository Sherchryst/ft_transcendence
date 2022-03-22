<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | ApongUs` : `ApongUs` }}</template>
    <!-- <title>testlol</title> -->
  </metainfo>
  <div id="container" class="min-h-screen">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text-primary;
  background: $bg-color;
}

// #nav {
//   padding: 30px;
// }

// #nav a {
//   font-weight: bold;
//   color: #2c3e50;
// }

// #nav a.router-link-exact-active {
//   color: #42b983;
// }

</style>

<script lang="ts">
import { useMeta } from 'vue-meta'

export default {
  setup () {
    useMeta({
      title: '',
    })
  }
}
</script>
