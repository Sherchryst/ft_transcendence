<template>
	<transition name="modal">
		<div class="micromodal-slide modal" :id="id" aria-hidden="true">
			<div class="modal__overlay py-6" tabindex="-1" data-micromodal-close @click.self="close">
				<div class="modal__container w-full mx-3" role="dialog" aria-modal="true" :aria-labelledby="id + '-title'">
					<header class="modal__header flex flex-row justify-between mb-3">
						<button class="modal__close invisible"></button>
						<h2 class="modal__title text-xl font-bold" :id="id + '-title'">
							<slot name="title"> Modal Title </slot>
						</h2>
						<button class="modal__close" aria-label="Close modal" data-micromodal-close @click="close"></button>
					</header>
					<div class="modal__content" :id="id + '-content'">
						<slot> Modal Content </slot>
					</div>
					<div class="modal__footer mt-3">
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script lang="typescript">
import { defineComponent } from 'vue'
// import MicroModal from 'micromodal';

export default defineComponent({
	name: 'Modal',
	props: {
		id: { type: String, required: true }
	},
	data() {
		return {
			showModal: false,
		}
	},
	methods: {
		open(){
			this.showModal = true
		},
		close(){
			this.showModal = false
			this.$emit('close');
		}
	},
})
</script>

<style lang="scss">
.modal {
	&__overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9998;
	}
	&__container {
		background-color: #fff;
		padding: 30px;
		max-width: 500px;
		max-height: 100vh;
		border-radius: 25px;
		overflow-y: auto;
		box-sizing: border-box;
	}
	&__close {
		background: transparent;
		border: 0;
		&:before { content: "\2715"; }
	}
}
@media (max-width: 768px) {
	.modal {
			&__overlay {
				align-items: flex-end;
		}
	}
}

.modal-enter-active,
.modal-leave-active{
	transition: opacity .3s cubic-bezier(0.0, 0.0, 0.2, 1);
	.modal__container {
		transition: all .3s cubic-bezier(0.0, 0.0, 0.2, 1);
	}
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from .modal__container {
	transform: translateY(15%);
}

.modal-leave-to .modal__container {
	transform: translateY(-10%);
}
</style>