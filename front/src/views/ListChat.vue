<template>
    <div class="grid-cols-1 md:grid grid-cols-3 gap-3 lg:gap-16 span-4">
        <div class=" mb-5">
            <form id="form-channel" class="flex flex-col gap-3" @submit.prevent="create">
                <div class="text-xl text-left font-bold form-title">New channel</div>
                <mod-input ref="name" name="name" type="text" placeholder="#-chan-name" v-model="formCreate.name">Name</mod-input>
                <mod-input ref="password" name="password" type="password" placeholder="Optional" v-model="formCreate.password">Password</mod-input>
                <switch-button @change="switchVisibility" name="visibility">Private</switch-button>
                <button-link type="submit" >Create</button-link>
            </form>
        </div>
        <div class="col-span-2 flex flex-col gap-4 lg:w-3/4">
            <title-count :lenght="listChannel.length">
                <h3 class="form-title font-bold text-2xl text-left">public channels</h3>
            </title-count>
            <channel-view v-for="chan in listChannel" :key="chan.id" :channel="chan"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { API } from '@/scripts/auth';
import { useMeta } from 'vue-meta'
import ChannelView from '@/components/chat/ChannelView.vue'
import { chatSocket } from '@/socket'
import { Channel } from '@/interfaces/Channel'
import SwitchButton from '../components/SwitchButton.vue'
import ModInput from '@/components/form/ModInput.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import TitleCount from '@/components/common/TitleCount.vue'

export default defineComponent ({
    components: {
    ChannelView,
    SwitchButton,
    ModInput,
    ButtonLink,
    TitleCount
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
                password: "",
                visibility: "public"
            }
        }
    },
    mounted() {
        this.socket
            .on("created", (data) => {
                for (let i = 0; i != this.listChannel.length; ++i) {
                    if (this.listChannel[i].id == data.channel.id)
                        return ;
                }
                if (data.channel.visibility == 'public')
                    this.listChannel.push(data.channel);
            })
        ;
        API.get('chat/list').then((response) => {
            this.listChannel = response.data
        }).catch(() => {
            this.listChannel = [];
        })
    },
    methods: {
        create(): void {
            API.post('chat/create', this.formCreate).then((response) => {
                for (let i = 0; i != this.listChannel.length; ++i)
                    if (this.listChannel[i].id == response.data.id)
                        return ;
                this.listChannel.push(response.data);
            }).catch(() => {
               // console.log(error)
            })
        },
        switchVisibility(): void {
            let visibility =  this.formCreate.visibility
            this.formCreate.visibility =  visibility == "public" ? "private" : "public"
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