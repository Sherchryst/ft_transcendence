<template>
    <div class="-mt-5 radio-panel">
        <input type="radio" name="my-input" v-bind:id="id" v-bind:value="id" :checked="checked" @change="input">
        <label class="flex" v-bind:for="id">
            <div class="round m-3"></div>
        </label>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "BigRadioButton",
    props: {
        id: { type: String, required: true },
        checked: Boolean
  },
  methods: {
      input(): void {
          this.$emit('minput', this.id)
      }
  }
})
</script>

<style lang="scss" scoped>
$transparent-color: rgb(102, 218, 233);
$color-radio: $secondary-color;
.map-1{
		label {
			background: url('../assets/classic.png') center !important;
		}
	}
.map-2{
		label {
			background: url('../assets/centaurus.png') center !important;
		}
	}
.map-3{
		label {
			background: url('../assets/andromeda.png') center !important;
		}
	}
.radio-panel{
    input {
        appearance: none;
        &:checked{
            ~label{
                outline: 4px solid $color-radio;
                :before{
                    background: $transparent-color;
                }
                .round{
                    border: 3px solid $color-radio;
                }
            }
        }
    }
    label {
        transition: 150ms all ease-in;
        .round {
            transition: 150ms all ease-in;
            font: inherit;
            color: currentColor;
            width: 0.75em;
            height: 0.75em;
            border: 1px solid $color-radio;
            background-color: #FFF;
            
            border-radius: 50%;
        }
        &:hover{
            outline: 2px solid $color-radio;
        }
        &:checked{
            outline: 4px solid $color-radio;
            .round{
                border: 3px solid $color-radio;
            }
        }
        @apply h-20;
        background: #FFF;
        background-size: cover !important;
        cursor: pointer;
        border-radius: 0px 14px 14px 14px;
    }
}
</style>