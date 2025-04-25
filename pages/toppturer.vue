<template>
  <!-- full‑screen slideshow -------------------------------------------------- -->
  <div class="relative h-screen w-screen overflow-hidden">
    <transition name="xfade">
      <img
        :key="currentSrc"
        :src="currentSrc"
        :class="[
          'absolute inset-0 w-full h-full object-cover select-none',
          objectPosClass      // <- centre or top, decided below
        ]"
        alt="Slideshow image"
      />
    </transition>

    <!-- headline & sub‑text --------------------------------------------------- -->
    <div class="pointer-events-none fixed bottom-8 left-8 z-10 text-white">
      <h1 class="font-semibold text-6xl md:text-7xl leading-none">
        {{ currentCategory.label }}
      </h1>
      <p class="mt-4 tracking-wide text-lg md:text-2xl font-medium">
        {{ currentCategory.subtext }}
      </p>
    </div>

    <!-- navigation buttons ---------------------------------------------------- -->
    <button class="nav-btn nav-prev text-base backdrop-blur-sm" @click="prev">Forrige</button>
    <button class="nav-btn nav-next text-base backdrop-blur-sm" @click="next">Neste</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

/* --- slideshow state ------------------------------------------------------- */
const catIdx = ref(0)
const imgIdx = ref(0)

const currentCategory = computed(() => categories[catIdx.value])
const currentSrc = computed(
  () => `/${currentCategory.value.slug}/${currentCategory.value.slug}_${imgIdx.value + 1}.jpg`
)

/* --- per‑image object‑position -------------------------------------------- */
const topAligned = new Set(['lowest_1', 'spring_9', 'spring_12'])

const objectPosClass = computed(() => {
  const key = `${currentCategory.value.slug}_${imgIdx.value + 1}`
  return topAligned.has(key) ? 'object-top' : 'object-center'
})

/* --- navigation ------------------------------------------------------------ */
function next () {
  if (imgIdx.value + 1 < currentCategory.value.count) {
    imgIdx.value++
  } else {
    catIdx.value = (catIdx.value + 1) % categories.length
    imgIdx.value = 0
  }
}
function prev () {
  if (imgIdx.value > 0) {
    imgIdx.value--
  } else {
    catIdx.value = (catIdx.value - 1 + categories.length) % categories.length
    imgIdx.value = categories[catIdx.value].count - 1
  }
}
</script>

<style>
/* cross‑fade identical to index.vue --------------------------------------- */
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

/* navigation buttons ------------------------------------------------------- */
.nav-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  padding: 0.5rem 1.25rem;
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