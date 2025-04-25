<template>
  <!-- full-screen slideshow -->
  <div class="relative h-screen w-screen overflow-hidden bg-black">
    <!-- Single transition container with both images -->
    <transition name="xfade" mode="in-out">
      <div
        v-if="displayedSrc"
        :key="displayedSrc"
        class="absolute inset-0 w-full h-full z-10"
      >
        <!-- blurred background (phone only) -->
        <img
          class="absolute inset-0 w-full h-full object-cover blur-md md:hidden select-none image-accel"
          :src="displayedSrc"
          alt="Slideshow blurred background"
        />

        <!-- main slideshow image (always present) -->
        <img
          class="absolute inset-0 w-full h-full object-contain md:object-cover md:object-center select-none image-accel"
          :src="displayedSrc"
          alt="Slideshow image"
        />
      </div>
    </transition>

    <!-- headline & sub-text -->
    <div class="pointer-events-none fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-10 text-white">
      <h1 class="font-semibold text-4xl md:text-7xl leading-none">
        {{ displayedCategory.label }}
      </h1>
      <p class="mt-2 sm:mt-4 tracking-wide text-base md:text-2xl font-medium">
        {{ displayedCategory.subtext }}
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

const catIdx = ref(0)
const imgIdx = ref(0)

const displayedSrc = ref<string | null>(null)
const displayedCategory = ref<Category>(categories[0])

function getSrcFor(catIndex: number, imageIndex: number) {
  const c = categories[catIndex]
  return `/${c.slug}/${c.slug}_${imageIndex + 1}.jpg`
}

function preloadImage (src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = reject
    image.src = src
  })
}

// Initial image & category
;(async () => {
  const startSrc = getSrcFor(catIdx.value, imgIdx.value)
  try {
    await preloadImage(startSrc)
  } catch(e) {
    console.error('Failed to load initial image:', e)
  }
  displayedSrc.value = startSrc
  displayedCategory.value = categories[catIdx.value]
})()

async function next() {
  const c = categories[catIdx.value]
  let nextCatIndex = catIdx.value
  let nextImgIndex = imgIdx.value + 1

  if (nextImgIndex >= c.count) {
    nextCatIndex = (catIdx.value + 1) % categories.length
    nextImgIndex = 0
  }
  const newSrc = getSrcFor(nextCatIndex, nextImgIndex)

  try {
    await preloadImage(newSrc)
    catIdx.value = nextCatIndex
    imgIdx.value = nextImgIndex
    displayedSrc.value = newSrc
    displayedCategory.value = categories[nextCatIndex]
  } catch (e) {
    console.error('Failed to load next image:', e)
  }
}

async function prev() {
  let newCatIndex = catIdx.value
  let newImgIndex = imgIdx.value - 1

  if (newImgIndex < 0) {
    newCatIndex = (catIdx.value - 1 + categories.length) % categories.length
    newImgIndex = categories[newCatIndex].count - 1
  }
  const newSrc = getSrcFor(newCatIndex, newImgIndex)

  try {
    await preloadImage(newSrc)
    catIdx.value = newCatIndex
    imgIdx.value = newImgIndex
    displayedSrc.value = newSrc
    displayedCategory.value = categories[newCatIndex]
  } catch (e) {
    console.error('Failed to load prev image:', e)
  }
}

// autoplay
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

watch(autoplay, playing => {
  playing ? startTimer() : stopTimer()
})

onUnmounted(stopTimer)
</script>

<style scoped>
.image-accel {
  will-change: opacity, transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* cross-fade transition for the combined container */
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
  z-index: 30;
  pointer-events: auto;
}
.nav-play:hover {
  background: rgba(0, 0, 0, 0.5);
}
.bg-green-700 {
  background-color: #15803d !important;
}
</style>