<template>
	<div class="micromodal-slide modal" :id="id" aria-hidden="true">
		<div class="modal__overlay py-6" tabindex="-1" data-micromodal-close>
			<div class="modal__container w-full mx-3" role="dialog" aria-modal="true" :aria-labelledby="id + '-title'">
				<header class="modal__header flex flex-row justify-between mb-3">
					<button class="modal__close invisible"></button>
					<h2 class="modal__title text-xl font-bold" :id="id + '-title'">
						<slot name="title"> Modal Title </slot>
					</h2>
					<button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
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
</template>

<script lang="typescript">
import { defineComponent } from 'vue'
import MicroModal from 'micromodal';

export default defineComponent({
	name: 'Modal',
	props: {
		id: { type: String, required: true }
	},
})
</script>

<style lang="scss">
.modal {
	display: none;
	&.is-open {
		display: block;
	}
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
		z-index: 103;
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

@keyframes mmfadeIn {
    from { opacity: 0; visibility: hidden}
      to { opacity: 1; }
}

@keyframes mmfadeOut {
    from { opacity: 1; }
      to { opacity: 0; }
}

@keyframes mmslideIn {
  from { transform: translateY(15%); }
    to { transform: translateY(0); }
}

@keyframes mmslideOut {
    from { transform: translateY(0); }
    to { transform: translateY(-10%); }
}

.micromodal-slide {
  display: none;
}

.micromodal-slide.is-open {
  display: block;
}

.micromodal-slide[aria-hidden="false"] .modal__overlay {
  animation: mmfadeIn .3s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.micromodal-slide[aria-hidden="false"] .modal__container {
  animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1);
}

.micromodal-slide[aria-hidden="true"] .modal__overlay {
  animation: mmfadeOut .3s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.micromodal-slide[aria-hidden="true"] .modal__container {
  animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1);
}

.micromodal-slide .modal__container,
.micromodal-slide .modal__overlay {
  will-change: transform;
}

</style>