<template>
    <div>
        <div @click="launchFilePicker()">
            <slot name="activator"></slot>
        </div>
        <input type="file" accept=".png , .jpg" ref="file" :name="uploadFieldName" @change="onFileChange($event)" style="display:none">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            uploadFieldName: 'file'
        }
    },
    props: {
        value: Object,
    },
    methods: {
        launchFilePicker() {
            (this.$refs['file'] as HTMLElement).click();
        },
        onFileChange(event: any) {
            const file = event.target.files[0];
            console.log(file);
            if (file && file instanceof File) {
                this.$emit('onInputImage', file);
            }
        }
    }
});
</script>




