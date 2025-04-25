<template>
  <!-- full-screen slideshow -->
  <div class="relative h-screen w-screen overflow-hidden">
    <transition name="xfade">
      <img
        ref="imgRef"
        :key="currentSrc"
        :src="currentSrc"
        :style="{ objectPosition: objectPosition }"
        class="absolute inset-0 w-full h-full object-cover select-none"
        alt="Slideshow image"
        @load="calculateOverflow"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      />
    </transition>

    <!-- headline & sub-text -->
    <div class="pointer-events-none fixed bottom-4 md:bottom-8 left-4 md:left-8 z-10 text-white">
      <h1 class="font-semibold text-4xl md:text-7xl leading-none">
        {{ currentCategory.label }}
      </h1>
      <p class="mt-1 md:mt-4 tracking-wide text-base md:text-2xl font-medium">
        {{ currentCategory.subtext }}
      </p>
    </div>

    <!-- navigation buttons -->
    <button class="nav-btn nav-prev text-xs md:text-base backdrop-blur-sm" @click="prev">Forrige</button>
    <button class="nav-btn nav-next text-xs md:text-base backdrop-blur-sm" @click="next">Neste</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Category {
  slug: string
  label: string
  count: number
  subtext: string
}

const categories: Category[] = [
  { slug: 'autumn',  label: 'Høst',   count: 3,  subtext: 'Eventyret starter.' },
  { slug: 'winter',  label: 'Vinter', count: 5,  subtext: 'Korte dager, lange turer.' },
  { slug: 'spring',  label: 'Vår',    count: 11, subtext: 'Naturen våkner.' },
  { slug: 'highest', label: 'Høyest', count: 1,  subtext: 'Det aller høyeste punktet.' },
  { slug: 'lowest',  label: 'Lavest', count: 1,  subtext: 'Og ned igjen.' },
  { slug: 'map',     label: 'Oversikt',   count: 1,  subtext: '19 topper.' }
]

/* --- slideshow state */
const catIdx = ref(0)
const imgIdx = ref(0)

const currentCategory = computed(() => categories[catIdx.value])
const currentSrc = computed(
  () => `/${currentCategory.value.slug}/${currentCategory.value.slug}_${imgIdx.value + 1}.jpg`
)

/* --- per-image object-position */
const topAligned = new Set(['lowest_1', 'spring_9', 'spring_12'])

const defaultObjectPosition = computed(() => {
  const key = `${currentCategory.value.slug}_${imgIdx.value + 1}`
  return topAligned.has(key) ? '50% 0%' : '50% 50%'
})

const objectPosition = ref(defaultObjectPosition.value)

watch(currentSrc, () => {
  objectPosition.value = defaultObjectPosition.value
})

/* --- image ref and overflow */
const imgRef = ref<HTMLImageElement | null>(null)
const overflowW = ref(0)
const overflowH = ref(0)

function calculateOverflow() {
  if (imgRef.value) {
    const iw = imgRef.value.naturalWidth
    const ih = imgRef.value.naturalHeight
    const cw = window.innerWidth
    const ch = window.innerHeight
    const aspectContainer = cw / ch
    const aspectImage = iw / ih
    let sw, sh
    if (aspectImage > aspectContainer) {
      // Image is wider, scale to fit height
      sh = ch
      sw = iw * (ch / ih)
      overflowW.value = sw - cw
      overflowH.value = 0
    } else {
      // Image is taller or equal, scale to fit width
      sw = cw
      sh = ih * (cw / iw)
      overflowW.value = 0
      overflowH.value = sh - ch
    }
  }
}

/* --- handle screen resize */
function onResize() {
  calculateOverflow()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

/* --- drag state */
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const initialOffsetX = ref(0)
const initialOffsetY = ref(0)

function onTouchStart(event: TouchEvent) {
  if (event.touches.length === 1) {
    isDragging.value = true
    startX.value = event.touches[0].clientX
    startY.value = event.touches[0].clientY
    const [px, py] = objectPosition.value.split(' ').map(p => parseFloat(p))
    initialOffsetX.value = (px / 100) * overflowW.value
    initialOffsetY.value = (py / 100) * overflowH.value
  }
}

function onTouchMove(event: TouchEvent) {
  if (isDragging.value && event.touches.length === 1) {
    const currentX = event.touches[0].clientX
    const currentY = event.touches[0].clientY
    const dx = currentX - startX.value
    const dy = currentY - startY.value

    // Calculate new offsets (image moves with finger, so offset decreases when dragging right/down)
    let newOffsetX = initialOffsetX.value - dx
    let newOffsetY = initialOffsetY.value - dy

    // Clamp offsets to prevent moving beyond image bounds
    newOffsetX = Math.max(0, Math.min(newOffsetX, overflowW.value))
    newOffsetY = Math.max(0, Math.min(newOffsetY, overflowH.value))

    // Calculate new percentages, keep at 50% if no overflow
    const newPx = overflowW.value > 0 ? (newOffsetX / overflowW.value) * 100 : parseFloat(objectPosition.value.split(' ')[0])
    const newPy = overflowH.value > 0 ? (newOffsetY / overflowH.value) * 100 : parseFloat(objectPosition.value.split(' ')[1])

    objectPosition.value = `${newPx}% ${newPy}%`
  }
}

function onTouchEnd() {
  isDragging.value = false
}

/* --- navigation */
function next() {
  if (imgIdx.value + 1 < currentCategory.value.count) {
    imgIdx.value++
  } else {
    catIdx.value = (catIdx.value + 1) % categories.length
    imgIdx.value = 0
  }
}

function prev() {
  if (imgIdx.value > 0) {
    imgIdx.value--
  } else {
    catIdx.value = (catIdx.value - 1 + categories.length) % categories.length
    imgIdx.value = categories[catIdx.value].count - 1
  }
}
</script>

<style scoped>
/* cross-fade identical to index.vue */
.xfade-enter-active,
.xfade-leave-active {
  transition: opacity 1.5s ease, filter 1.5s ease;
}
.xfade-enter-from,
.xfade-leave-to {
  opacity: 0;
  filter: blur(10px);
}
.xfade-enter-to,
.xfade-leave-from {
  opacity: 1;
  filter: blur(0);
}

/* navigation buttons */
.nav-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: #fff;
  background: rgba(0,0,0,.30);
  border-radius: 0.375rem;
  transition: background .15s ease;
  -webkit-tap-highlight-color: transparent;
}
.nav-btn:hover { background: rgba(0,0,0,.50); }

.nav-prev { left: 1rem; }
.nav-next { right: 1rem; }

@media (min-width: 768px) {
  .nav-prev { left: 2rem; }
  .nav-next { right: 2rem; }
}
</style>