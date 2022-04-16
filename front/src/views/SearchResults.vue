<template>
  <div :key="expr">
    <div v-for="user in matchs" :key="user.id">
        <router-link :to="{name: 'profile', params: {username: user.login}}">
            <img class="image mt-2 h-15 w-15 invisible lg:visible justify-self-end" :src="'http://localhost:3000/' + user.avatarPath">
            {{user.nickname}}
        </router-link>
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
</style>