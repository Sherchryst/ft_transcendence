<template>
  <div class="chat grid grid-cols-12 gap-5">
      <div class="col-span-4 list flex flex-col px-7 py-5">
          <h4 class="text-left font-bold text-xl mb-4" >Messages directs</h4>
          <discussion-preview class="active" />
          <discussion-preview />
          <discussion-preview />
          <h4 class="text-left font-bold text-xl mt-4" >Channels</h4>
          <discussion-preview />
      </div>
      <div class="col-span-8 conversation px-7 py-5">
            <message side="1">
                Lorem ipsum dolor
            </message>
            <message side="0">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
      </div>
  </div>
</template>

<script lang="ts">
import DiscussionPreview from '@/components/DiscussionPreview.vue'
import Message from '@/components/Message.vue'

export default {
    components: {
        DiscussionPreview,
        Message
  },
}
</script>
        Message

<style lang="scss" scoped>
.chat{
    > div{
         min-height: 77vh;
         border-radius: 25px;
    }
    .list{
        background: $panel-color;
        h4 {
            color: $bg--lg-color;
        }
    }
    .conversation{
        background: $panel--dk-color;
    }
}
</style>