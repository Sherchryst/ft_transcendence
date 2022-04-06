<template>
    <div class="grid grid-cols-12 lg:gap-x-16 2xl:gap-x-32">
        <div class="col-span-12 md:col-span-4 flex flex-col max-w-sm">
            <div class="mb-10">
                <ChooseAvatar @input="inputImage($event)">
                    <template v-slot:activator>
                        <div v-if="!avatar" class="grey frame flex flex-col place-content-center w-64 h-64 mb-10">
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
            <ButtonLink route="edit-profile" class="flex justify-center w-full"  text="Edit Profile"></ButtonLink>
        </div>
    </div>
</template>

<script lang="ts">
import ChooseAvatar from "@/components/ChooseAvatar.vue";
import { defineComponent } from "vue";
import SwitchButton from "@/components/SwitchButton.vue";
import ProfilePicture from "@/components/profile/ProfilePicture.vue";
import ButtonLink from "@/components/ButtonLink.vue";

export default defineComponent({
    components: {
        ChooseAvatar,
        SwitchButton,
        ProfilePicture,
        ButtonLink
    },
    data () {
        return {
        avatar: null,
        imageURL: ''
        }
    },
    methods: {
        inputImage(image: File) {
            this.avatar = image
            this.imageURL = URL.createObjectURL(image)
        },
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
</style>
