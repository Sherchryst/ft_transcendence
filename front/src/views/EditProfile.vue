<template>
    <div class="grid grid-cols-12 lg:gap-x-16 2xl:gap-x-32">
        <div class="col-span-12 md:col-span-4 flex flex-col max-w-sm">
            <form @submit.prevent="send">
                <div class="mb-10">
                    <ChooseAvatar @onInputImage="inputImage($event)">
                        <template v-slot:activator>
                            <div v-if="inside" class="grey frame flex flex-col place-content-center w-64 h-64 mb-10">
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
                    <input type="text" class="title-username input" id="username" name="username" v-model="nickname" placeholder="username" required>
                </div>
                <div class="mb-20 flex flex-row place-content-center">
                    <label class="pt-1 title-username" for="2F Authentication">2F Authentication:</label>
                    <SwitchButton></SwitchButton>
                </div>
                <div class="btn self-center">
                    <button type="submit" class="px-7 py-3 pb-2"> Register </button>
                </div>
            </form>
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

export default defineComponent({
    components: {
        ChooseAvatar,
        SwitchButton,
        ProfilePicture,
    },
    data () {
        return {
        avatar: {} as File,
        imageURL: '',
        nickname: '',
        inside: true
        }
    },
    methods: {
        inputImage(image: File) {
            this.avatar = image;
            this.imageURL = URL.createObjectURL(image);
            this.inside = false;
        },
        send() {
            var formData = new FormData();
            formData.append('file', this.avatar);
            formData.append('id', this.$store.getters.getId);
            API.post('users/update-nickname', {
                id: this.$store.getters.getId,
                nickname: this.nickname
            }).then( () => {
                this.$store.dispatch('connection').then( () => {
                    router.push({name: "profile", params: {username: this.$store.getters.getLogin}});
                })
            }).catch(function(error) {
                console.log(error);
            });
            API.post('users/update-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }}).catch(function(error) {
                console.log("update failed", error);
            });
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
