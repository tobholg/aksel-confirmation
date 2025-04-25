<template>
    <!-- full‑screen slideshow ------------------------------------------------- -->
    <div class="relative h-screen w-screen overflow-hidden">
      <!-- cross‑fade / blur transition -->
      <transition name="xfade">
        <img
          :key="currentSrc"
          :src="currentSrc"
          class="absolute inset-0 w-full h-full object-cover object-top select-none"
          alt="Slideshow image"
        />
      </transition>
  
      <!-- fixed text block ---------------------------------------------------- -->
      <div class="pointer-events-none fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-10 text-white">
        <h1 class="font-semibold text-5xl md:text-7xl leading-none">
          Aksel&nbsp;T. <br>Follett
        </h1>
        <p class="mt-4 tracking-wide text-lg md:text-2xl font-medium">
          26.&nbsp;April&nbsp;2025
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  
  /* --- slideshow sources ---------------------------------------------------- */
  const images = [
    '/index_2.png',
    '/index_1.png',
    '/index_3.png',
    '/index_4.png',
    '/index_5.png',
  ]
  
  const idx = ref(0)
  const currentSrc = computed(() => images[idx.value])
  
  /* --- timer --------------------------------------------------------------- */
  let timer: ReturnType<typeof setInterval>
  
  onMounted(() => {
    timer = setInterval(() => {
      idx.value = (idx.value + 1) % images.length
    }, 6000)
  })
  
  onBeforeUnmount(() => clearInterval(timer))
  </script>
  
  <style>
  /* cross‑fade with a subtle blur ------------------------------------------- */
  .xfade-enter-active,
  .xfade-leave-active {
    transition: opacity 4s ease, filter 4s ease;
  }
  
  /* starting / ending states */
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
  </style>