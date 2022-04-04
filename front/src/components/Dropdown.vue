<template>
	<section class="dropDownMenuWrapper">

		<button class="dropDownMenuButton" ref="menu" @click="openClose">
			<NotifIcon class="h-12 w-12" />
		</button>

		<section class="dropdownMenu" v-if="isOpen">
			<div class="menuArrow" />
			<slot/>
		</section>

	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotifIcon from '@/assets/icon/notification.svg';

export default defineComponent ({
	name: "Dropdown",
	components: {
		NotifIcon
	},
	data() {
		return {
			isOpen: false
		}
	},
	methods: {
		openClose() {
			const closeListerner = (e: Event) => {
				if ( this.catchOutsideClick(e, this.$refs['menu'] as HTMLCanvasElement ) )
				window.removeEventListener('click', closeListerner), this.isOpen = false
			}
			window.addEventListener('click', closeListerner)
			this.isOpen = !this.isOpen
		},
		catchOutsideClick(event: Event, dropdown: HTMLCanvasElement) {
			if( dropdown == event.target )
				return false
			if( this.isOpen && dropdown != event.target )
				return true
		}
	}
})
</script>

<style lang="scss" scoped>
.dropDownMenuWrapper {
  position: relative;
  width: 50px;
//   height: 80px;
  border-radius: 8px;
  background: white;
  border: 1px solid #eee;
//   box-shadow: 10px 10px 0 0 rgba(black,.03);
//   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  * {
    box-sizing: border-box;
    text-align: left;
  }

  .dropDownMenuButton {
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 2;
    cursor: pointer;
  }

  .dropdownMenu {
    position: absolute;
    top: 100%;
    width: 100%;
    min-width: 300px;
    min-height: 10px;
    border-radius: 8px;
    border: 1px solid #eee;
    box-shadow: 10px 10px 0 0 rgba(black,.03);
    background: white;
    padding: 10px 30px;
    animation: menu 0.3s ease forwards;

    .menuArrow {
      width: 20px;
      height: 20px;
      position: absolute;
      top: -10px;
      left: 20px;
      border-left: 1px solid #eee;
      border-top: 1px solid #eee;
      background: white;
      transform: rotate(45deg);
      border-radius: 4px 0 0 0;
    }

    .menuArrow--dark {
      background: #333;
      border: none;
    }

    .option {
      width: 100%;
      border-bottom: 1px solid #eee;
      padding: 20px 0;
      cursor: pointer;
      position: relative;
      z-index: 2;

      &:last-child {
        border-bottom: 0;
      }

      * {
        color: inherit;
        text-decoration: none;
        background: none;
        border: 0;
        padding: 0;
        outline: none;
        cursor: pointer;
      }

    }

    .desc {
      opacity: 0.5;
      display: block;
      width: 100%;
      font-size: 14px;
      margin: 3px 0 0 0;
      cursor: default;
    }

  }

  .dropdownMenu--dark {
    background: #333;
    border: none;

    .option {
      border-bottom: 1px solid #888;
    }

    * {
      color: #eee;
    }

  }

  @keyframes menu {
    from { transform: translate3d( 0, 30px ,0 ) }
    to { transform: translate3d( 0, 20px ,0 ) }
  }

}

.dropDownMenuWrapper--noTitle {
  padding: 0;
  width: 60px;
  height: 60px;
}

.dropDownMenuWrapper--dark {
  background: #333;
  border: none;
}
</style>