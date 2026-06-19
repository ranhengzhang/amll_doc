<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface CarouselImage {
  src: string
  alt?: string
}

const props = withDefaults(defineProps<{
  images: CarouselImage[]
  width?: string
  autoplay?: boolean
  interval?: number
  loop?: boolean
}>(), {
  width: 'auto',
  autoplay: true,
  interval: 4000,
  loop: true
})

const current = ref(0)
const container = ref<HTMLElement | null>(null)
const isTransitioning = ref(false)
let autoplayTimer: ReturnType<typeof setInterval> | null = null
let transitionTimer: ReturnType<typeof setTimeout> | null = null

const canPrev = computed(() => props.loop || current.value > 0)
const canNext = computed(() => props.loop || current.value < props.images.length - 1)

const goTo = (index: number) => {
  if (index === current.value) return
  if (index < 0) index = props.loop ? props.images.length - 1 : 0
  if (index >= props.images.length) index = props.loop ? 0 : props.images.length - 1
  isTransitioning.value = true
  current.value = index
  if (transitionTimer) clearTimeout(transitionTimer)
  transitionTimer = setTimeout(() => {
    isTransitioning.value = false
  }, 400)
}

const prev = () => goTo(current.value - 1)
const next = () => goTo(current.value + 1)

// Touch / swipe
let touchStartX = 0
let touchDeltaX = 0

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
  touchDeltaX = 0
}

const onTouchMove = (e: TouchEvent) => {
  touchDeltaX = e.touches[0].clientX - touchStartX
}

const onTouchEnd = () => {
  const threshold = 50
  if (touchDeltaX > threshold) prev()
  else if (touchDeltaX < -threshold) next()
}

// Keyboard
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

// Autoplay
const startAutoplay = () => {
  if (!props.autoplay || props.images.length <= 1) return
  stopAutoplay()
  autoplayTimer = setInterval(() => next(), props.interval)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  if (transitionTimer) clearTimeout(transitionTimer)
})
</script>

<template>
  <div
    class="image-carousel"
    ref="container"
    :style="{ width }"
    tabindex="0"
    @keydown="onKeydown"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="carousel-track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <div v-for="(img, i) in images" :key="i" class="carousel-slide">
        <img :src="img.src" :alt="img.alt || `image-${i + 1}`" draggable="false" />
      </div>
    </div>

    <button
      v-if="images.length > 1"
      class="nav-btn nav-prev"
      :disabled="!canPrev"
      @click="prev"
      aria-label="Previous"
    >
      <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button
      v-if="images.length > 1"
      class="nav-btn nav-next"
      :disabled="!canNext"
      @click="next"
      aria-label="Next"
    >
      <svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <div v-if="images.length > 1" class="carousel-dots">
      <button
        v-for="(img, i) in images"
        :key="i"
        class="dot"
        :class="{ active: i === current }"
        @mouseenter="goTo(i)"
        :aria-label="`Go to slide ${i + 1}`"
      />
    </div>

    <div v-if="images.length > 1" class="carousel-counter">
      {{ current + 1 }} / {{ images.length }}
    </div>
  </div>
</template>

<style scoped>
.image-carousel {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  outline: none;
  line-height: 0;
}

.carousel-track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
}

.carousel-slide img {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: background 0.2s, opacity 0.2s;
  padding: 0;
  z-index: 2;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
}

.nav-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.nav-prev {
  left: 10px;
}

.nav-next {
  right: 10px;
}

.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
  line-height: 1;
}

.dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.2s, width 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.dot.active {
  background: rgba(255, 255, 255, 0.8);
  width: 20px;
  border-radius: 4px;
}

.carousel-counter {
  position: absolute;
  top: 10px;
  right: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  pointer-events: none;
  line-height: 1;
  z-index: 2;
}

/* Dark mode */
:global(.dark) .nav-btn {
  background: rgba(40, 40, 40, 0.85);
  color: #ddd;
}

:global(.dark) .nav-btn:hover:not(:disabled) {
  background: rgba(60, 60, 60, 1);
}

:global(.dark) .dot {
  background: rgba(255, 255, 255, 0.35);
}

:global(.dark) .dot.active {
  background: rgba(255, 255, 255, 0.8);
}
</style>
