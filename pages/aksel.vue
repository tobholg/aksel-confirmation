<template>
  <!-- full-screen slideshow -->
  <div class="relative h-screen w-screen overflow-hidden bg-black">
    <!-- blurred background (phone only) -->
    <transition name="bgfade">
      <img
        v-if="displayedSrc"
        :key="displayedSrc + '-blur'"
        :src="displayedSrc"
        class="absolute inset-0 w-full h-full object-cover blur-md md:hidden select-none z-0 image-accel"
        alt="Slideshow blurred background"
      />
    </transition>

    <!-- main slideshow image -->
    <transition name="xfade">
      <img
        v-if="displayedSrc"
        :key="displayedSrc"
        :src="displayedSrc"
        class="absolute inset-0 w-full h-full object-contain md:object-cover md:object-center select-none z-10 image-accel"
        alt="Slideshow image"
      />
    </transition>

    <!-- headline & sub-text -->
    <div class="pointer-events-none fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-10 text-white">
      <h1 class="font-semibold text-4xl md:text-7xl leading-none">
        {{ label }}
      </h1>
      <p class="mt-2 sm:mt-4 tracking-wide text-base md:text-2xl font-medium">
        {{ subtext }}
      </p>
    </div>

    <!-- navigation buttons -->
    <button class="nav-btn nav-prev text-xs sm:text-base backdrop-blur-sm" @click="prev">
      Forrige
    </button>
    <button class="nav-btn nav-next text-xs sm:text-base backdrop-blur-sm" @click="next">
      Neste
    </button>

    <!-- autoplay toggle (bottom-right) -->
    <button
      class="nav-play text-xs sm:text-base backdrop-blur-sm"
      :class="autoplay ? 'bg-green-700' : ''"
      @click="togglePlay"
    >
      {{ autoplay ? 'Stopp' : 'Spill av' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

/* --- static copy --------------------------------------------------------- */
const label   = 'Aksel T. Follett'
const subtext = 'Vi er stolte av vår konfirmant!'

/* --- total images -------------------------------------------------------- */
const COUNT = 40 // e.g. aksel_1.jpg … aksel_40.jpg

/**
 * displayedSrc = what's currently visible on screen
 * nextSrc = next image path to preload before showing
 */
const displayedSrc = ref<string | null>(null)
const imgIdx = ref(0)

/* --- utility: preload an image ------------------------------------------ */
async function preloadImage (src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = reject
    image.src = src
  })
}

/**
 * Initialize the first loaded image on mount.
 * We preload akse_1.jpg so we don't see a blank/flicker initially.
 */
(async () => {
  const first = `/aksel/aksel_${imgIdx.value + 1}.jpg`
  await preloadImage(first).catch(() => {})
  displayedSrc.value = first
})()

/* --- helpers to get next/prev index -------------------------------------- */
function getNextIndex () {
  return (imgIdx.value + 1) % COUNT
}
function getPrevIndex () {
  return (imgIdx.value - 1 + COUNT) % COUNT
}

/* --- navigation ---------------------------------------------------------- */
async function next () {
  const newIndex = getNextIndex()
  const newSrc = `/aksel/aksel_${newIndex + 1}.jpg`
  try {
    await preloadImage(newSrc)
    imgIdx.value = newIndex
    displayedSrc.value = newSrc
  } catch (e) {
    console.error('Failed to load next image:', e)
  }
}

async function prev () {
  const newIndex = getPrevIndex()
  const newSrc = `/aksel/aksel_${newIndex + 1}.jpg`
  try {
    await preloadImage(newSrc)
    imgIdx.value = newIndex
    displayedSrc.value = newSrc
  } catch (e) {
    console.error('Failed to load prev image:', e)
  }
}

/* --- autoplay ------------------------------------------------------------ */
const autoplay = ref(false)
let timer: number | null = null

function startTimer () {
  timer = window.setInterval(() => {
    next()
  }, 5000)
}
function stopTimer () {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}
function togglePlay () {
  autoplay.value = !autoplay.value
}

watch(autoplay, (playing) => {
  playing ? startTimer() : stopTimer()
})

onUnmounted(stopTimer)
</script>

<style scoped>
/* hardware-acceleration helper for images */
.image-accel {
  will-change: opacity, transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* cross-fade transition for main image ------------------------------------ */
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

/* simple cross-fade for blurred background (opacity only) ----------------- */
.bgfade-enter-active,
.bgfade-leave-active {
  transition: opacity 1.5s ease;
}
.bgfade-enter-from,
.bgfade-leave-to {
  opacity: 0;
}
.bgfade-enter-to,
.bgfade-leave-from {
  opacity: 1;
}

/* navigation buttons ------------------------------------------------------ */
.nav-btn {
  position: fixed;
  z-index: 20;
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.375rem;
  transition: background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
.nav-btn:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* prev / next (vertically centered) */
.nav-prev,
.nav-next {
  top: 50%;
  transform: translateY(-50%);
}
.nav-prev {
  left: 1rem;
}
.nav-next {
  right: 1rem;
}
@media (min-width: 768px) {
  .nav-prev {
    left: 2rem;
  }
  .nav-next {
    right: 2rem;
  }
}

/* autoplay toggle (bottom-right) ------------------------------------------ */
.nav-play {
  position: fixed !important;
  bottom: 1rem;
  right: 1rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  line-height: 1;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.375rem;
  backdrop-filter: blur(4px);
  white-space: nowrap;
  display: inline-block;
  height: auto;
  width: auto;
  transition: background 0.15s ease;
  z-index: 30;          /* ensures button is above the slideshow image */
  pointer-events: auto; /* ensures it's clickable */
}
.nav-play:hover {
  background: rgba(0, 0, 0, 0.5);
}
.bg-green-700 {
  background-color: #15803d !important;
}
</style>