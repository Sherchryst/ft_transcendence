<template>
  <div class="LogInOut" :key="state">
    <div v-if="state == 0">
      <button v-on:click="login42()">Login42</button> <br>
      <button v-on:click="cheat_login()">cheat login</button> <br>
    </div>
    <div v-else-if="state == 2">
      <input v-model="digits" placeholder="Google authenticator Code">
      <button v-on:click="send_digit_code('/authenticate')">Send</button>
    </div>
    <div v-else>
      <div v-if="state == 1">
        <button v-on:click="generate_qrcode()">Generate qrcode</button> <br>
        <div v-if="qrcode">
          <img v-bind:src="qrcode"/> <br>
          <input v-model="digits" placeholder="Google authenticator Code">
          <button v-on:click="send_digit_code('/turn-on')">Send</button>
        </div>
      </div>
      <button v-on:click="go_to_chat()">chat</button>
      <button v-on:click="go_to_game()">game</button>
      <button v-on:click="logout()">Logout</button> <br>
    </div>
    <button v-on:click="ping()">Ping</button>
  </div>
</template>

<script lang="ts">
import { API } from '@/scripts/auth.ts';
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
      API.post('auth/logout')
      sessionStorage.setItem("state", State.NOTLOGIN.toString())
      sessionStorage.clear()
      this.state = State.NOTLOGIN
    },
    generate_qrcode(): void {
      API.post('2fa/generate', {}, {responseType: 'arraybuffer'}).then((response) => {
        var bytes = new Uint8Array(response.data);
        var binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
        this.qrcode = "data:image/png;base64," + btoa(binary);
      })
    },
    send_digit_code(path: string): void {
      API.post('2fa' + path, {twoFactorAuthenticationCode: this.digits}).then((response) => {
        sessionStorage.setItem("state", State.AUTH.toString())
        this.state = State.AUTH
        console.log(response.data)
      }).catch((response) => {
        console.log(response)
      })
    },
    ping(): void {
      API.get('ping').then((response) => {
        console.log(response)
      }).catch((response) => {
        console.log(response)
      })
    },
    cheat_login(): void {
      API.get('auth/cheat_login').then((response) => {
        console.log(response)
        sessionStorage.setItem("state", State.AUTH.toString())
        this.state = State.AUTH
      }).catch((response) => {
        console.log(response)
      })
    },
    go_to_chat(): void {
      router.push('/chat')
    },
    go_to_game(): void {
      router.push('/game')
    }
  }
})
</script>
