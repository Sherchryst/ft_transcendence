<template>
    <div class="grid grid-cols-12 lg:gap-x-16 2xl:gap-x-32">
        <div class="col-span-12 md:col-span-4 flex flex-col max-w-sm">
            <form @submit.prevent="send">
                <div class="mb-10">
                    <ChooseAvatar @onInputImage="inputImage($event)">
                        <template v-slot:activator>
                            <div v-if="inside" class="grey frame flex flex-col place-content-center w-64 h-64">
                                <span class="title-username">Click to add avatar</span>
                            </div>
                            <div v-else class="flex place-content-center">
                                <ProfilePicture :avatar="imageURL"></ProfilePicture>
                            </div>
                        </template>
                    </ChooseAvatar>
                </div>
                <div class="flex flex-col title-username self-center mb-16 space-y-4">
                    <label for="username">Enter username:</label>
                    <input type="text" class="title-username input" id="username" name="username" v-model="nickname" placeholder="username">
                </div>
                <div class="mb-20 flex flex-row place-content-center">
                    <label class="pt-1 title-username" for="2F Authentication">2F Authentication:</label>
                    <SwitchButton @onSwitched="inputSwitch($event)"></SwitchButton>
                    
                </div>
                <div class="btn self-center">
                    <button type="submit" class="px-7 py-3 pb-2"> Register </button>
                </div>
            </form>
        </div>
        <div v-if="qrcode && switchOn == true" class="col-span-12 lg:col-span-8 2xl:col-span-7 flex flex-col max-w-sm">
            <ProfilePanel>
                <template v-slot:title>
                    <MainTitle>QR Code</MainTitle>
                </template>
                <template v-slot:body>
                    <div class="flex flex-col justify-evenly place-content-center">
                    <div class="w-64" >
                        <img class="w-64 h-64 mb-20" :src="qrcode">
                        <input v-model="digits" class="mb-10" placeholder="Google authenticator Code">
                        <button v-on:click="send_digit_code('/turn-on')" class="btn px-7 py-3 pb-2"> Send </button>
                    </div>
                    </div>
                </template>
            </ProfilePanel>
        </div>
    </div>
</template>

<script lang="ts">
import ChooseAvatar from "@/components/ChooseAvatar.vue";
import { defineComponent } from "vue";
import SwitchButton from "@/components/SwitchButton.vue";
import ProfilePicture from "@/components/profile/ProfilePicture.vue";
import { API } from "@/scripts/auth";
import router from "@/router";
import ProfilePanel from "@/components/profile/ProfilePanel.vue";
import MainTitle from "@/components/MainTitle.vue";

export enum State {
  NOTLOGIN,
  NO2FA,
  NO2AUTH,
  AUTH
}

export default defineComponent({
    components: {
    ChooseAvatar,
    SwitchButton,
    ProfilePicture,
    ProfilePanel,
    MainTitle
},
    data () {
        return {
        state: {} as State,
        avatar: {} as File,
        imageURL: '',
        nickname: '',
        switch: false,
        switchOn: false,
        inside: true,
        digits: "",
        qrcode: "",
        }
    },
    watch: {
        switchOn(newVal: boolean) {
            if (newVal) {
                this.generate_qrcode();
            }
        }
    },
    methods: {
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
            this.switchOn = false
            console.log('Data', response.data)
        }).catch((response) => {
            console.log('Response', response)
        })
        },
        inputImage(image: File) {
            this.avatar = image;
            this.imageURL = URL.createObjectURL(image);
            this.inside = false;
        },
        inputSwitch(is2fa: boolean) {
            is2fa ? this.switch = true : this.switch = false;
            this.switchOn = this.switch;
            console.log('switch', is2fa);
        },
        send() {
            var formData = new FormData();
            formData.append('file', this.avatar);
            formData.append('id', this.$store.getters.getId);
            if (this.nickname.length > 0)
                API.post('users/update-nickname', {
                    id: this.$store.getters.getId,
                    nickname: this.nickname
                }).catch(function(error) {
                    console.log(error);
                });
            console.log('avatar', this.avatar);
            if(this.avatar.size > 0)
                API.post('users/update-avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }}).catch(function(error) {
                    console.log("update failed", error);
                });
            router.push({name: "profile", params: {username: this.$store.getters.getLogin}});
        }
    }
});
</script>

<style lang="scss" scoped>
.frame {
  border: 10px solid ;
  margin: auto;
  // padding: 15px 25px;
  border-radius: 94px;
  filter: drop-shadow(0px 4px 4px rgba(7, 53, 70, 0.22));
}

a, .btn{
	color: white;
	background: $action;
	border-radius: 10px;
	cursor: pointer;
	box-shadow: 0px 4px 4px rgba(142, 172, 171, 0.31);
	transition: 200ms all ease-in;
	&:hover{
		background: $dark-font;
		// transform: translatey(-2px);
		// outline: 0.1em solid $action;
	}
}
.btn{
	&-neutral{
		color: $dark-font;
		background: #dfdfdf;
		&:hover{
			background: darken($color: #dfdfdf, $amount: 5%);
		}
	}
	&-used{
		background: $dark-font;
	}
}
</style>
