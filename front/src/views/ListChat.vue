<template>
    <div class="grid-cols-1 md:grid grid-cols-3 gap-4 span-4">
        <div class=" mb-5">
            <form id="form-channel" class="flex flex-col gap-3" @submit.prevent="create">
                <div class="text-xl text-left font-bold form-title">New channel</div>
                <mod-input ref="name" name="name" type="text" placeholder="#-chan-name" v-model="formCreate.name">Name</mod-input>
                <mod-input name="password" type="password" placeholder="Optional">Password</mod-input>
                <switch-button @change="switchVisibility" name="visibility">Private</switch-button>
                <button-link type="submit" >Create</button-link>
            </form>
        </div>
        <div class="col-span-2" :key="listChannel">
            <channel-view v-for="chan in listChannel" :key="chan.id" :channel="chan"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { API } from '@/scripts/auth.ts';
import { useMeta } from 'vue-meta'
import ChannelView from '@/components/chat/ChannelView.vue'
import { chatSocket } from '@/socket.ts'
import { Channel } from '@/interfaces/Channel'
import SwitchButton from '../components/SwitchButton.vue'
import ModInput from '@/components/form/ModInput.vue';
import ButtonLink from '@/components/ButtonLink.vue';

export default defineComponent ({
    components: {
    ChannelView,
    SwitchButton,
    ModInput,
    ButtonLink,
},
    beforeRouteLeave(to, from, next) {
        next()
    },
    setup () {
        useMeta({ title: 'Channels' })
    },
    data() {
        return {
            socket : chatSocket,
            listChannel: [] as Channel[],
            formCreate: {
                name: "",
                visibility: "public"
            }
        }
    },
    // computed: {
    //     // visibility(): string {
    //     //     return ""
    //     // }
    // },
    mounted() {
        this.socket
            .on("connect", () => {
                console.log("Connected, ", this.socket.id);
            })
            .on("disconnect", (reason) => {
                console.log("Deconnected", reason);
            })
            .on("created", (data: {channel: Channel}) => {
                this.listChannel.push(data.channel)
            })
        ;
        API.get('chat/list').then((response) => {
            this.listChannel = response.data
            console.log(this.listChannel);
        }).catch((error) => {
            this.listChannel = [];
        })
    },
    methods: {
        create(): void {
            this.socket.emit("create", this.formCreate)
		},
        switchVisibility(): void {
            let visibility =  this.formCreate.visibility
            console.log("SWITCH")
            this.formCreate.visibility =  visibility == "public" ? "private" : "public"
            console.log(this.formCreate.visibility)
        }
    }
})
</script>

<style lang="scss" scoped>
.chan{
    border-radius: 12px;
    .title{
        color: $dark-font;
    }
    &:hover{
        background: $panel-color;
    }
}
.form-title {
    color: $dark-font
}
</style>