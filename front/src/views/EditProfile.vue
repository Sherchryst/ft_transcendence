<template>
    <div class="grid grid-cols-12 lg:gap-x-16 2xl:gap-x-32">
        <div class="col-span-12 md:col-span-4 flex flex-col max-w-sm">
            <form @submit.prevent="send">
                <div class="mb-4">
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
                <div class="flex flex-col title-username self-center mb-6 space-y-4">
                    <ModInput name="username" placeholder="Username" v-model="nickname">Username</ModInput>
                </div>
                <div v-if="Is2fa" class="mb-8">
                    <button type="button" v-on:click="deactivated_2fa" class="btn px-7 py-3 pb-2"> Deactivated 2fa </button>
                </div>
                <div v-else class="mb-8 flex flex-col place-content-center">
                    <ModLabel name="2F Authentication">2F Authentication</ModLabel>
                    <SwitchButton @onSwitched="inputSwitch($event)"></SwitchButton>
                </div>
                <ButtonLink class="flex justify-center w-full" type="submit"> Edit Profile </ButtonLink>
            </form>
        </div>
        <div v-if="qrcode && SwitchOn == true" class="col-span-12 lg:col-span-8 2xl:col-span-7 flex flex-col max-w-sm">
            <ProfilePanel>
                <template v-slot:title>
                    <MainTitle>QR Code</MainTitle>
                </template>
                <template v-slot:body>
                    <div class="flex flex-col justify-evenly items-center">
                        <div class="w-64 felx flex-col c-center">
                            <img class="w-64 h-64 mb-8 qrcode p-5" :src="qrcode">
                            <ModInput v-model="digits" class="mb-10" placeholder="Google authenticator Code"></ModInput>
                            <!-- <input v-model="digits" class="mb-10" placeholder="Google authenticator Code"> -->
                            <button v-on:click="send_digit_code('/turn-on')" class="btn px-7 py-3 pb-2 w-full"> Send </button>
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
import ButtonLink from "@/components/ButtonLink.vue";
import ModInput from "@/components/form/ModInput.vue";
import ModLabel from "@/components/form/ModLabel.vue";
import {reload_socket} from '@/socket';

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
    MainTitle,
    ButtonLink,
    ModInput,
    ModLabel
},
    data () {
        return {
        state: {} as State,
        avatar: {} as File,
        imageURL: '',
        nickname: '',
        Switch: false,
        SwitchOn: false,
        Is2fa: false,
        inside: true,
        digits: "",
        qrcode: "",
        }
    },
    watch: {
        SwitchOn(newVal: boolean) {
            if (newVal) {
                this.generate_qrcode();
            }
        }
    },
    mounted() {
        this.Is2fa = this.$store.getters.is2FA;
    },
    methods: {
        deactivated_2fa() {
            API.post('2fa/turn-off').then(() => {
                this.Is2fa = false;
                this.SwitchOn = false;
                this.Switch = false;
                this.digits = "";
                this.qrcode = "";
            });
        },
        generate_qrcode(): void {
        API.post('2fa/generate', {}, {responseType: 'arraybuffer'}).then((response) => {
            var bytes = new Uint8Array(response.data);
            var binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
            this.qrcode = "data:image/png;base64," + btoa(binary);
        }).catch(() => {
            //console.log(error);
        });
        },
        send_digit_code(path: string): void {
        API.post('2fa' + path, {twoFactorAuthenticationCode: this.digits}).then(() => {
            reload_socket();
            sessionStorage.setItem("state", State.AUTH.toString())
            this.state = State.AUTH
            this.SwitchOn = false
            this.$store.dispatch('connection');
            this.Is2fa = this.$store.getters.is2FA;
        }).catch(() => {
            //console.log(error);
        });
        },
        inputImage(image: File) {
            this.avatar = image;
            this.imageURL = URL.createObjectURL(image);
            this.inside = false;
        },
        inputSwitch(is2fa: boolean) {
            is2fa ? this.Switch = true : this.Switch = false;
            this.SwitchOn = this.Switch;
        },
        async send() {
            var formData = new FormData();
            formData.append('file', this.avatar);
            formData.append('id', this.$store.getters.getId);
            if (this.nickname.length > 0)
                await API.post('users/update-nickname', {
                    id: this.$store.getters.getId,
                    nickname: this.nickname
                }).catch(() => {
                    //console.log(error);
                });
            if(this.avatar.size > 0)
                await API.post('users/update-avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }}).catch(() => {
                    //console.log(error);
                });
            this.$store.dispatch('connection').then(() => {
                router.push({name: "profile", params: {username: this.$store.getters.getLogin}});
            });
        }
    }
});
</script>

<style lang="scss" scoped>
.qrcode{
    background-color: white;
    border-radius: 50px;
}
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
