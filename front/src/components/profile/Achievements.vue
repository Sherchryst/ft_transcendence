<template>
    <div class="grid md:grid-cols-2 gap-x-10 gap-y-5">
        <div v-for="(achiev, index) in AchievementsTab" :key="index">
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
        achievementsTab: { type: Array, required: true },
    },
    data() {
        return {
            AchievementsTab: [] as Achievement[],
        };
    },
    components: {
        LargerCard
    },
    watch: {
        achievementsTab: {
            handler(newVal: Achievement[]) {
                this.AchievementsTab = newVal.slice(0, 4);
            },
            deep: true,
        },
    },
});
</script>
