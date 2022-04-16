<template>
  <div :key="expr">
    <div class="grid grid-cols-12 overflow-auto ">
        <div class="col-span-12 md:col-span-4 gap-4 flex flex-col max-w-sm">
            <div class="card max-h-16 w-60" v-for="user in matchs" :key="user.id">
                <router-link :to="{name: 'profile', params: {username: user.login}}">
                    <div class=" grid grid-cols-2">
                        <div>
                            <img class="image ml-6 mt-3 h-15 w-15 justify-self-end" :src="'http://localhost:3000/' + user.avatarPath">
                        </div>
                        <div class=" mt-3 flex flex-col justify-evenly">
                            <div>
                                {{user.nickname}}
                            </div>
                            <div>
                                {{user.login}}
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { API } from '@/scripts/auth'

export default defineComponent({
	name: "search",
    props: {
        expr: {type: String, required: true}
    },
    data() {
        return {
            matchs: []
        }
    },
    setup () {
        useMeta({ title: 'search' })
    },
    beforeUpdate() {
        this.search()
    },
    mounted() {
        this.search()
    },
    methods: {
        search() {
        API.get('users/search', {params: {expr: this.expr}}).then((res) => {
                this.matchs = res.data
            }).catch(() => {
            this.matchs = []
        })
        }
    }
})
</script>

<style lang="scss" scoped>
.error-number{
	color: $dark-font;
}

.card {
  background-color: white;
  border-radius: 10px;
}
</style>