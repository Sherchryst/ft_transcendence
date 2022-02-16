<template>
  <div class="chat grid grid-cols-12 gap-5">
      <div class="col-span-4 list">

      </div>
      <div class="col-span-8 conversation">

      </div>
  </div>
</template>

<script lang="ts">

export default {
    components: {
  },
}
</script>

<style lang="scss" scoped>
.chat{
    > div{
         min-height: 77vh;
         border-radius: 25px;
    }
    .list{
        background: $panel-color;
    }
    .conversation{
        background: $panel--dk-color;
    }
}
</style>