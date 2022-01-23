<template>
  <div class="LogInOut">
    <button v-on:click="login42()">Login42</button> <br>
    <button v-on:click="test_login()">Test login</button> <br>
    <button v-on:click="logout()">Logout</button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import axios from 'axios';
import router from '@/router';

export default {
    data() {
    return {
      isLogged: false
    }
  },
  methods: {
    login42(): void {
      router.push('/42');
    },
    test_login(): void {
      axios.get('http://localhost:3000/auth/test').then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    },
    logout(): void {
      axios.post('http://localhost:3000/auth/logout').then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>
