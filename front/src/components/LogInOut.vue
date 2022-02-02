<template>
  <div class="LogInOut" :key="state">
    <div v-if="state == 0">
      <button v-on:click="login42()">Login42</button> <br>
    </div>
    <div v-else>
      <div v-if="state == 1">
        <button v-on:click="generate_qrcode()">Generate qrcode</button> <br>
      </div>
      <div v-if="state == 2">
        <input v-model="digits" placeholder="Google authenticator Code">
        <button v-on:click="send_digit_code('/authenticate')">Send</button>
      </div>
      <button v-on:click="logout()">Logout</button> <br>
    </div>
    <div v-if="qrcode && state == 1">
      <img v-bind:src="qrcode"/> <br>
      <input v-model="digits" placeholder="Google authenticator Code">
      <button v-on:click="send_digit_code('/authenticate')">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import router from '@/router';
import { useRoute } from 'vue-router'
import { defineComponent } from 'vue';

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
    if (route.query.is2fa == "true") {
      sessionStorage.setItem("state", State.NO2AUTH.toString())
      router.replace({query: {}})
    }
    if (route.query.is2fa == "false") {
      sessionStorage.setItem("state", State.NO2FA.toString())
      router.replace({query: {}})
    }
    this.state = Number(sessionStorage.getItem("state"))
    console.log("create", sessionStorage.getItem("state"), route.query.is2fa)
  },
  updated() {
    this.state = Number(sessionStorage.getItem("state"))
    console.log("updated", this.state)
  },
  methods: {
    login42(): void {
      router.push('/42');
    },
    logout(): void {
      axios.post('http://localhost:3000/auth/logout')
      sessionStorage.setItem("state", State.NOTLOGIN.toString())
      this.state = State.NOTLOGIN
    },
    generate_qrcode(): void {
      axios.post('http://localhost:3000/2fa/generate', {}, {responseType: 'arraybuffer'}).then((response) => {
        var bytes = new Uint8Array(response.data);
        var binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
        this.qrcode = "data:image/png;base64," + btoa(binary);
      })
    },
    send_digit_code(path: string): void {
      axios.post('http://localhost:3000/2fa' + path, {twoFactorAuthenticationCode: this.digits}).then((response) => {
        sessionStorage.setItem("state", State.AUTH.toString())
        this.state = State.AUTH
      }).catch((response) => {
        console.log(response)
      })
    }
  }
})
</script>
