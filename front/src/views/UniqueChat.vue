<template>
      <div class="col-span-8 conversation flex flex-col justify-between px-7 py-5">
          <div id="chat" class="flex-auto mb-5 overflow-x-auto">
            <message side="0">
                Lorem ipsum dolor
            </message>
            <message side="1">
                Lorem ipsum dolor sit
            </message>
            <message side="0">
                Lorem
            </message>
            <message side="0">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic soluta animi. Perspiciatis tenetur numquam harum eaque veritatis dicta odit illum magni.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt impedit mollitia numquam voluptatibus, necessitatibus amet neque sint hic.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, elit.
            </message>
            <message side="1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            </message>
            <message side="0">
                Lorem ipsum dolor
            </message>
            <message side="1">
                Lorem ipsum
            </message>
            <message side="0">
                Lorem ipsum dolor sit amet
            </message>
            <message side="1">
                 Lorem ipsum dolor sit amet consectetur
            </message>
            <message side="0">
                Lorem ipsum dolor sit
            </message>
          </div>
          <one-row-form placeholder="Message">
                <span class="flex flex-row items-center">
                    <span class="pl-2 pr-1">Envoyer</span>
                    <SendIcon/>
                </span>
           </one-row-form>
      </div>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
    .conversation{
        background: #E2E3F2;
    }
</style>

<!-- <template>
    <div class="chat" :key="history ">
        <h1>Chat</h1>
        <button v-on:click="go_to_home()">Home</button> <br>
        <span v-if="channel">
            <h2>{{channel.name}}</h2>
            <div v-for="omsg in history" :key="omsg">
                <p>{{omsg.from}}: {{omsg.content}}</p>
            </div>
            <form @submit.prevent="send">
                <input v-model="msg"/>
            </form>
            <button v-on:click="leave_channel()">Leave</button>
        </span>
        <span v-else>
            <div v-for="chan in listChannel" :key="chan.id">
                <button v-on:click="join(chan.id)">join {{chan.name}}</button>
            </div>
            <input v-model="newChan">
            <button v-on:click="create()">create</button>
        </span>
    </div>
</template> -->

<script lang="ts">

import router from '@/router';
import { defineComponent } from 'vue';
import axios from 'axios';
// import DiscussionPreview from '@/components/DiscussionPreview.vue'
import Message from '@/components/Message.vue'
import OneRowForm from '@/components/OneRowForm.vue'
import SendIcon from '@/assets/icon/send.svg';
import { useMeta } from 'vue-meta'



export default defineComponent({
    components: {
        // DiscussionPreview,
        Message,
        OneRowForm,
        SendIcon,
    },
    setup () {
        useMeta({ title: 'Chat' })
    },
    data() {
        return {
        }
    },
    mounted() {
        var chat = document.getElementById('chat');
        if (chat != null) {
            chat.scrollTop = chat.scrollHeight;
        }
    },
    methods: {
    }
})

</script>
