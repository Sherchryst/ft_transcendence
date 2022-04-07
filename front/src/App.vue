<template>
  <div id="container" class="min-h-screen">
    <metainfo>
      <template v-slot:title="{ content }">{{ content ? `${content} | ApongUs` : `ApongUs` }}</template>
      <!-- <title>testlol</title> -->
    </metainfo>
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

.s-dropdown {
    background-color: white;
    @apply p-5;
    @apply mt-3;
    // border: 1px solid #eee;
    border-radius: 10px;

    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
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
