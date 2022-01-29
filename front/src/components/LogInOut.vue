<template>
  <div class="LogInOut">
    <button v-on:click="login42()">Login42</button> <br>
    <button v-on:click="generate_qrcode()">Generate qrcode</button> <br>
    <button v-on:click="logout()">Logout</button> <br>
    <button v-on:click="test_login()">Test login</button> <br>
    <div v-if="isQrcode">
    <img v-bind:src="qrcode"/> <br>
    <input v-model="digits" placeholder="Google authenticator Code">
    <button v-on:click="send_digit_code()">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import router from '@/router';
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
    return {
      qrcode: "",
      isQrcode: false,
      digits: ""
    }
  },
  methods: {
    login42(): void {
      router.push('/42');
    },
    test_login(): void {
      axios.get('http://localhost:3000/auth/test').then((response) => {
        console.log("logged in")
      }).catch((response) => {
        console.log("logged out")
      })
    },
    logout(): void {
      axios.post('http://localhost:3000/auth/logout')
    },
    generate_qrcode(): void {
      axios.post('http://localhost:3000/2fa/generate', {}, {responseType: 'arraybuffer'}).then((response) => {
        var bytes = new Uint8Array(response.data);
        var binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
        this.qrcode = "data:image/png;base64," + btoa(binary);
        this.isQrcode = true;
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
