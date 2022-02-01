<template>
  <div class="LogInOut">
    <button v-on:click="login42()">Login42</button> <br>
    <button v-on:click="generate_qrcode()">Generate qrcode</button> <br>
    <button v-on:click="logout()">Logout</button> <br>
    <div v-if="qrcode">
    <img v-bind:src="qrcode"/> <br>
    <input v-model="digits" placeholder="Google authenticator Code">
    <button v-on:click="send_digit_code()">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import router from '@/router';
import { useRoute } from 'vue-router'
import { defineComponent, computed } from 'vue';

export enum State {
  NOTLOGIN,
  NO2FA,
  NO2AUTH,
  AUTH
}

export default defineComponent({
    data() {
    return {
      qrcode: "",
      digits: "",
      state: {} as State
    }
  },
  created() {
    const route = useRoute()
    const path = computed(() => route.path)
    console.log(path)
  },
  methods: {
    login42(): void {
      router.push('/42');
    },
    logout(): void {
      axios.post('http://localhost:3000/auth/logout')
    },
    generate_qrcode(): void {
      axios.post('http://localhost:3000/2fa/generate', {}, {responseType: 'arraybuffer'}).then((response) => {
        var bytes = new Uint8Array(response.data);
        var binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
        this.qrcode = "data:image/png;base64," + btoa(binary);
      })
    },
    send_digit_code(): void {
      axios.post('http://localhost:3000/2fa/turn-on', {twoFactorAuthenticationCode: this.digits}).then((response) => {
        console.log(response.data)
      }).catch((response) => {
        console.log(response)
      })
    }
  }
})
</script>
