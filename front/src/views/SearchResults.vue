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
import { defineComponent, watch } from 'vue'
import { useMeta } from 'vue-meta'
import { API } from '@/scripts/auth'
import router from '@/router';

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
    created() {
       watch(
           () => this.$route.params.expr,
           (newExpr) => {
               if (newExpr) {
                   this.matchs = []
                   this.search(String(newExpr))
               }
           }
       )
   },
    mounted() {
        this.search(this.expr)
    },
    methods: {
        search(expr: string) {
        API.get('users/search', {params: {expr: expr}}).then((res) => {
                this.matchs = res.data
            }).catch(() => {
                router.push({name: 'home'})
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