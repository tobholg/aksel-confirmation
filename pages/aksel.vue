<template>
  <!-- full-screen slideshow -->
  <div class="relative h-screen w-screen overflow-hidden bg-black">
    <transition name="xfade">
      <img
        ref="imgRef"
        :key="currentSrc"
        :src="currentSrc"
        :style="{ objectPosition }"
        class="absolute inset-0 w-full h-full object-cover select-none"
        alt="Slideshow image"
        @load="calculateOverflow"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      />
    </transition>

    <!-- gradient overlay (bottom 1/3 fades from black@80 % to transparent) -->
    <div
      class="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none
             bg-gradient-to-t from-black/80 to-transparent"
    ></div>

    <!-- headline & sub-text -->
    <div class="pointer-events-none fixed bottom-4 md:bottom-8 left-4 md:left-8 z-10 text-white">
      <h1 class="font-semibold text-4xl md:text-7xl leading-none">
        {{ label }}
      </h1>
      <p class="mt-1 md:mt-4 tracking-wide text-base md:text-2xl font-medium">
        {{ subtext }}
      </p>
    </div>

    <!-- navigation buttons -->
    <button class="nav-btn nav-prev text-xs md:text-base backdrop-blur-sm" @click="prev">Forrige</button>
    <button class="nav-btn nav-next text-xs md:text-base backdrop-blur-sm" @click="next">Neste</button>

    <!-- autoplay toggle (bottom-right) -->
    <button
      class="nav-play text-xs font-semibold md:text-base backdrop-blur-sm"
      :class="autoplay ? 'bg-green-700' : ''"
      @click="togglePlay"
    >
      {{ autoplay ? 'Stopp' : 'Spill av' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineProps } from 'vue'

/* --- props & static copy -------------------------------------------------- */
const props = defineProps<{ topBias?: number }>()       // 0 = top, 50 = centred
const TOP_BIAS_PCT = props.topBias ?? 40                // default = 25 %

const label   = 'Aksel T. Follett'
const subtext = 'Vi er stolte av vår konfirmant!'

/* --- slideshow state ------------------------------------------------------ */
const COUNT  = 38                         // aksel_1.jpg … aksel_40.jpg
const imgIdx = ref(0)
const currentSrc = computed(() => `/aksel/aksel_${imgIdx.value + 1}.jpg`)

/* --- image ref and overflow ---------------------------------------------- */
const imgRef = ref<HTMLImageElement | null>(null)
const overflowW = ref(0)
const overflowH = ref(0)
/* 👉 seed with the vertical bias */
const objectPosition = ref(`50% ${TOP_BIAS_PCT}%`)

function calculateOverflow() {
  if (!imgRef.value) return
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

/* --- handle screen resize ------------------------------------------------- */
onMounted(() => window.addEventListener('resize', calculateOverflow))
onUnmounted(() => window.removeEventListener('resize', calculateOverflow))

/* --- drag state ----------------------------------------------------------- */
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const initialOffsetX = ref(0)
const initialOffsetY = ref(0)

function onTouchStart(event: TouchEvent) {
  if (event.touches.length !== 1) return
  isDragging.value = true
  startX.value = event.touches[0].clientX
  startY.value = event.touches[0].clientY
  const [px, py] = objectPosition.value.split(' ').map(p => parseFloat(p))
  initialOffsetX.value = (px / 100) * overflowW.value
  initialOffsetY.value = (py / 100) * overflowH.value
}

function onTouchMove(event: TouchEvent) {
  if (!isDragging.value || event.touches.length !== 1) return
  const currentX = event.touches[0].clientX
  const currentY = event.touches[0].clientY
  const dx = currentX - startX.value
  const dy = currentY - startY.value

  // Calculate new offsets
  let newOffsetX = initialOffsetX.value - dx
  let newOffsetY = initialOffsetY.value - dy

  // Clamp offsets
  newOffsetX = Math.max(0, Math.min(newOffsetX, overflowW.value))
  newOffsetY = Math.max(0, Math.min(newOffsetY, overflowH.value))

  // Calculate new percentages
  const newPx = overflowW.value ? (newOffsetX / overflowW.value) * 100 : 50
  const newPy = overflowH.value ? (newOffsetY / overflowH.value) * 100 : TOP_BIAS_PCT

  objectPosition.value = `${newPx}% ${newPy}%`
}

function onTouchEnd() {
  isDragging.value = false
}

/* --- navigation ----------------------------------------------------------- */
function next() {
  imgIdx.value = (imgIdx.value + 1) % COUNT
}

function prev() {
  imgIdx.value = (imgIdx.value - 1 + COUNT) % COUNT
}

/* --- autoplay ------------------------------------------------------------- */
const autoplay = ref(false)
let timer: number | null = null

function startTimer() {
  timer = window.setInterval(next, 5000)   // 5-second delay
}

function stopTimer() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function togglePlay() {
  autoplay.value = !autoplay.value
}

watch(autoplay, playing => (playing ? startTimer() : stopTimer()))
onUnmounted(stopTimer)

/* --- reset bias on every new slide --------------------------------------- */
watch(currentSrc, () => {
  objectPosition.value = `50% ${TOP_BIAS_PCT}%`
})
</script>

<style scoped>
/* cross-fade (same as toppturer.vue) */
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
  z-index: 20;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  color: #fff;
  background: rgba(0,0,0,.30);
  border-radius: 0.375rem;
  transition: background .15s ease;
  -webkit-tap-highlight-color: transparent;
}

.nav-prev,
.nav-next {
  top: 50%;
  transform: translateY(-50%);
}
.nav-prev { left: 1rem; }
.nav-next { right: 1rem; }

/* autoplay toggle (bottom-right) */
.nav-play {
  position: fixed !important;
  bottom: 1rem;
  right: 1rem;
  padding: 0.75rem 1rem;
  line-height: 1;
  color: #fff;
  background: rgba(0,0,0,.30);
  border-radius: 0.375rem;
  backdrop-filter: blur(4px);
  white-space: nowrap;
  transition: background .15s ease;
}
.nav-play:hover { background: rgba(0,0,0,.50); }

.nav-btn:hover { background: rgba(0,0,0,.50); }

@media (min-width: 768px) {
  .nav-prev { left: 2rem; }
  .nav-next { right: 2rem; }
}
</style>