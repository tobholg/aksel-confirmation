<template>
  <!-- full-screen slideshow -->
  <div class="relative h-screen w-screen overflow-hidden bg-black">
    <!-- blurred background (phone only) -->
    <transition name="bgfade">
      <img
        :key="currentSrc + '-blur'"
        :src="currentSrc"
        class="absolute inset-0 w-full h-full object-cover blur-md md:hidden select-none z-0"
        alt="Slideshow blurred background"
      />
    </transition>

    <!-- main slideshow image -->
    <transition name="xfade">
      <img
        :key="currentSrc"
        :src="currentSrc"
        class="absolute inset-0 w-full h-full object-contain md:object-cover md:object-center select-none z-10"
        alt="Slideshow image"
      />
    </transition>

    <!-- headline & sub-text -->
    <div class="pointer-events-none fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-10 text-white">
      <h1 class="font-semibold text-4xl md:text-7xl leading-none">
        {{ currentCategory.label }}
      </h1>
      <p class="mt-2 sm:mt-4 tracking-wide text-base md:text-2xl font-medium">
        {{ currentCategory.subtext }}
      </p>
    </div>

    <!-- navigation buttons -->
    <button
      class="nav-btn nav-prev text-sm sm:text-base backdrop-blur-sm"
      @click="prev"
    >
      Forrige
    </button>
    <button
      class="nav-btn nav-next text-sm sm:text-base backdrop-blur-sm"
      @click="next"
    >
      Neste
    </button>

    <!-- autoplay toggle (bottom-right) -->
    <button
      class="nav-play text-base backdrop-blur-sm"
      :class="autoplay ? 'bg-green-700' : ''"
      @click="togglePlay"
    >
      {{ autoplay ? 'Stopp' : 'Spill av' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

interface Category {
  slug: string
  label: string
  count: number
  subtext: string
}

const categories: Category[] = [
  { slug: 'autumn',  label: 'Høst',    count: 3,  subtext: 'Eventyret starter.' },
  { slug: 'winter',  label: 'Vinter',  count: 5,  subtext: 'Korte dager, lange turer.' },
  { slug: 'spring',  label: 'Vår',     count: 11, subtext: 'Naturen våkner.' },
  { slug: 'highest', label: 'Høyest',  count: 1,  subtext: 'Det aller høyeste punktet.' },
  { slug: 'lowest',  label: 'Lavest',  count: 1,  subtext: 'Og ned igjen.' },
  { slug: 'map',     label: 'Oversikt',count: 1,  subtext: '19 topper.' },
]

/* slideshow state */
const catIdx = ref(0)
const imgIdx = ref(0)

const currentCategory = computed(() => categories[catIdx.value])
const currentSrc = computed(() => {
  return `/${currentCategory.value.slug}/${currentCategory.value.slug}_${imgIdx.value + 1}.jpg`
})

/* navigation */
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

/* autoplay */
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

<style>
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

/* cross-fade for blurred background (mobile only) ------------------------- */
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
  padding: 0.5rem 1.25rem;
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
  font-size: 0.875rem;
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
</style>