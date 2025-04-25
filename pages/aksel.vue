<template>
  <!-- full-screen slideshow -->
  <div class="relative h-screen w-screen overflow-hidden bg-black">

    <!-- unified crossfade of blurred background + main image -->
    <transition-group
      name="xfade"
      tag="div"
      class="absolute inset-0 w-full h-full z-10"
      @leave="onMainLeave"
    >
      <div
        v-for="slide in slides"
        :key="slide.id"
        class="absolute inset-0 w-full h-full"
      >
        <!-- blurred background (phone only) -->
        <img
          class="absolute inset-0 w-full h-full object-cover blur-md image-accel md:hidden"
          :src="slide.src"
          alt="Slideshow blurred background"
        />
        <!-- main slideshow image -->
        <img
          class="absolute inset-0 w-full h-full object-contain md:object-cover md:object-center select-none image-accel"
          :src="slide.src"
          alt="Slideshow image"
        />
      </div>
    </transition-group>

    <!-- headline & sub-text -->
    <div class="pointer-events-none fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-20 text-white">
      <h1 class="font-semibold text-4xl md:text-7xl leading-none">
        {{ label }}
      </h1>
      <p class="mt-2 sm:mt-4 tracking-wide text-base md:text-2xl font-medium">
        {{ subtext }}
      </p>
    </div>

    <!-- navigation buttons -->
    <button
      class="nav-btn nav-prev text-xs sm:text-base backdrop-blur-sm"
      @click="prev"
    >
      Forrige
    </button>
    <button
      class="nav-btn nav-next text-xs sm:text-base backdrop-blur-sm"
      @click="next"
    >
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
import { ref, watch, onUnmounted } from 'vue'

/** Static label and subtext: */
const label = 'Aksel T. Follett'
const subtext = 'Vi er stolte av vår konfirmant!'

/** We have 40 images: /aksel/aksel_1.jpg … /aksel/aksel_40.jpg  */
const COUNT = 40

/** Each slide is an object: { id: number, src: string } */
interface Slide {
  id: number
  src: string
}

const slides = ref<Slide[]>([])

/** We'll store our current index in `imgIdx`. */
let imgIdx = 0
let slideIdCounter = 1

/** Build the image path for a given index: */
function buildSrc(index: number) {
  return `/aksel/aksel_${index + 1}.jpg`
}

/** Preload an image before showing it. */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve()
    i.onerror = reject
    i.src = src
  })
}

/** Add a new slide (for crossfade). Remove the old slide on transition end. */
async function showSlide(index: number) {
  const src = buildSrc(index)
  try {
    await preloadImage(src)
    slides.value.push({
      id: ++slideIdCounter,
      src,
    })
  } catch (err) {
    console.error('Failed to load image:', err)
  }
}

/** Called for each leaving element in our transition-group. */
function onMainLeave(el: Element) {
  if (slides.value.length > 1) {
    slides.value.shift()
  }
}

/** Initialize by showing the first image. */
showSlide(imgIdx)

/** Next & Prev */
async function next() {
  imgIdx = (imgIdx + 1) % COUNT
  await showSlide(imgIdx)
}
async function prev() {
  imgIdx = (imgIdx - 1 + COUNT) % COUNT
  await showSlide(imgIdx)
}

/** Autoplay */
const autoplay = ref(false)
let timer: number | null = null

function startTimer() {
  timer = window.setInterval(next, 5000)
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

/* single crossfade transition for both blurred bg + main image,
   but with no animated blur—only opacity */
.xfade-enter-active,
.xfade-leave-active {
  transition: opacity 1.5s ease;
  position: absolute;
}
.xfade-enter-from,
.xfade-leave-to {
  opacity: 0;
}
.xfade-enter-to,
.xfade-leave-from {
  opacity: 1;
}

/* navigation buttons ------------------------------------------------------ */
.nav-btn {
  position: fixed;
  z-index: 30;
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
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  line-height: 1;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.375rem;
  backdrop-filter: blur(4px);
  white-space: nowrap;
  display: inline-block;
  transition: background 0.15s ease;
  z-index: 40;
  pointer-events: auto;
}
.nav-play:hover {
  background: rgba(0, 0, 0, 0.5);
}
.bg-green-700 {
  background-color: #15803d !important;
}
</style>