<template>
    <div>
        <div @click="launchFilePicker()">
            <slot name="activator"></slot>
        </div>
        <input type="file" ref="file" :name="uploadFieldName" @change="onFileChange($event.target.name, $event.target.files)" style="display:none">
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
            this.$refs.file.click();
        },
        onFileChange(name, files) {
            this.$emit('input', files[0]);
        }
    }
});
</script>




