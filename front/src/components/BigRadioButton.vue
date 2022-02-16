<template>
    <div class="radio-panel">
        <input type="radio" name="my-input" v-bind:id="id" v-bind:value="id">
        <label class="flex" v-bind:for="id">
            <div class="round m-3"></div>
        </label>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    id: String
  }
})

export default class HelloWorld extends Vue {
  id!: string
}
</script>

<style lang="scss" scoped>
    input {
        appearance: none;
        &:checked{
            ~label{
                border: 4px solid #062B62;
                .round{
                    border: 3px solid #062B62;
                }
            }
        }
    }
    label {
        .round {
            font: inherit;
            color: currentColor;
            width: 0.75em;
            height: 0.75em;
            border: 1px solid #062B62;
            border-radius: 50%;      
        }
        &:hover{
            border: 2px solid #062B62;
        }
        &:checked{
            border: 4px solid #062B62;
            .round{
                border: 3px solid #062B62;
            }
        }
        width: 144px;
        height: 98px;
        background: #FFF;
        border: 4px solid #FFF;
        cursor: pointer;
        border-radius: 0px 14px 14px 14px;
    }
</style>