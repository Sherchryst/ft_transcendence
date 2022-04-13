<template>
    <div class="grid md:grid-cols-2 gap-x-10 gap-y-5">
        <div v-for="(achiev, index) in achievements.slice(0, 4)" :key="index">
            <LargerCard v-if="achiev.unlocked_at != null" :description="achiev.description.toUpperCase()" :title="achiev.name.toUpperCase()"></LargerCard>
            <LargerCard v-else class="lg-card-inactive" :description="achiev.description.toUpperCase()" :title="achiev.name.toUpperCase()"></LargerCard>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LargerCard from "@/components/profile/LargerCard.vue";
import { Achievement } from "@/interfaces/Profile";

export default defineComponent({
    name: "Achievements",
    props: {
        achievements: { type:  Array as () => Achievement[], required: true },
    },
    components: {
        LargerCard
    },
});
</script>
