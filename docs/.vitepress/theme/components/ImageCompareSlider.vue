<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  imgBefore: string
  imgAfter: string
  initialPosition?: number
  width?: string
}>(), {
  initialPosition: 50,
  width: 'auto'
})

const container = ref<HTMLElement | null>(null)
const position = ref(props.initialPosition)
const isDragging = ref(false)

const updatePosition = (clientX: number) => {
  if (!container.value) return
  const rect = container.value.getBoundingClientRect()
  const x = clientX - rect.left
  position.value = Math.max(0, Math.min(100, (x / rect.width) * 100))
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  updatePosition(e.clientX)
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  if (e.touches.length > 0) {
    e.preventDefault()
    updatePosition(e.touches[0].clientX)
  }
}

const endDrag = () => {
  isDragging.value = false
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  if (e instanceof MouseEvent) {
    updatePosition(e.clientX)
  } else if (e.touches.length > 0) {
    updatePosition(e.touches[0].clientX)
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', endDrag)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', endDrag)
})
</script>

<template>
  <div
    class="image-compare-slider"
    ref="container"
    :style="{ width }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <div class="overlay after-layer" :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }">
      <img class="overlay-image" :src="imgBefore" alt="before" draggable="false" />
      <span class="label label-before">Before</span>
    </div>
    <div class="overlay before-layer" :style="{ clipPath: `inset(0 0 0 ${position}%)` }">
      <img class="overlay-image" :src="imgAfter" alt="after" draggable="false" />
      <span class="label label-after">After</span>
    </div>
    <div class="divider" :style="{ left: position + '%' }">
      <div class="handle">
        <span class="arrow arrow-left"></span>
        <span class="arrow arrow-right"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-compare-slider {
  position: relative;
  display: inline-block;
  overflow: hidden;
  user-select: none;
  cursor: ew-resize;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  line-height: 0;
}

.base-image,
.overlay-image {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.after-layer {
  position: relative;
}

.label {
  position: absolute;
  top: 8px;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  pointer-events: none;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.label-after {
  right: 8px;
}

.label-before {
  left: 8px;
}

.divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  transform: translateX(-50%);
  pointer-events: none;
}

.handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.arrow {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

.arrow-left {
  border-right: 6px solid #333;
}

.arrow-right {
  border-left: 6px solid #333;
}
</style>
