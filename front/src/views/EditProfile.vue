<template>
    <div class="grid grid-cols-12">
        <div class="col-span-4">
            <GamePanel title="Edit" action_name="Save">
                <form>
                    <div class="flex flex-col items-center gap-3">
                        <div>
                            <ChooseAvatar></ChooseAvatar>
                        </div>
                        <div class="flex flex-col-reverse mt-4">
                            <input class="px-3 py-2" type="text" name="username" id="username">
                            <label class="text-left" for="username">Username</label>
                        </div>
                        <div class="flex flex-col items-center mt-10">
                            <span class="mb-1">2FA Authentication</span>
                            <SwitchButton></SwitchButton>
                        </div>
                    </div>
                </form>
            </GamePanel>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GamePanel from '@/components/GamePanel.vue';
import SwitchButton from '@/components/SwitchButton.vue';
import ChooseAvatar from '../components/ChooseAvatar.vue';

export default defineComponent({
    name: "EditProfile",
    components: { GamePanel, SwitchButton, ChooseAvatar }
})
</script>
