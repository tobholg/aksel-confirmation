<template>
    <!-- full-screen slideshow -------------------------------------------------- -->
    <div class="relative h-screen w-screen overflow-hidden">
      <transition name="xfade">
        <img
          :key="currentSrc"
          :src="currentSrc"
          class="absolute inset-0 w-full h-full object-cover select-none object-center"
          alt="Slideshow image"
        />
      </transition>
  
      <!-- headline & sub-text --------------------------------------------------- -->
      <div class="pointer-events-none fixed bottom-8 left-8 z-10 text-white">
        <h1 class="font-semibold text-6xl md:text-7xl leading-none">
          {{ label }}
        </h1>
        <p class="mt-4 tracking-wide text-lg md:text-2xl font-medium">
          {{ subtext }}
        </p>
      </div>
  
      <!-- navigation buttons ---------------------------------------------------- -->
      <button class="nav-btn nav-prev text-base backdrop-blur-sm" @click="prev">Forrige</button>
      <button class="nav-btn nav-next text-base backdrop-blur-sm" @click="next">Neste</button>
  
      <!-- autoplay toggle (top-right) ------------------------------------------ -->
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
  
  /* --- static copy ------------------ */
  const label   = 'Aksel T. Follett'
  const subtext = 'Vi er stolte over vår konfirmant!'
  
  /* --- slideshow state --------------- */
  const COUNT  = 40          // aksel_1.jpg … aksel_40.jpg
  const imgIdx = ref(0)
  const currentSrc = computed(() => `/aksel/aksel_${imgIdx.value + 1}.jpg`)
  
  /* --- navigation -------------------- */
  function next () {
    imgIdx.value = (imgIdx.value + 1) % COUNT
  }
  function prev () {
    imgIdx.value = (imgIdx.value - 1 + COUNT) % COUNT
  }
  
  /* --- autoplay ---------------------- */
  const autoplay = ref(false)
  let timer: number | null = null
  
  function startTimer () {
    timer = window.setInterval(next, 5000)   // 4-second delay; tweak as you wish
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
  
  watch(autoplay, playing => {
    playing ? startTimer() : stopTimer()
  })
  onUnmounted(stopTimer)
  </script>
  
  <style>
  /* cross-fade (same as toppturer.vue) ---------------------------------------- */
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
    z-index: 20;
    padding: 0.5rem 1.25rem;
    font-weight: 600;
    color: #fff;
    background: rgba(0,0,0,.30);
    border-radius: 0.375rem;
    transition: background .15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* prev / next (vertically centred) */
  .nav-prev,
  .nav-next {
    top: 50%;
    transform: translateY(-50%);
  }
  .nav-prev { left: 1rem; }
  .nav-next { right: 1rem; }
  
  /* autoplay toggle (bottom‑right) */
  .nav-play {
    position: fixed !important;
    bottom: 1rem;
    right: 1rem;
    /* basic button look */
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    line-height: 1;
    color: #fff;
    background: rgba(0,0,0,.30);
    border-radius: 0.375rem;
    backdrop-filter: blur(4px);
    white-space: nowrap;
    display: inline-block;
    height: auto;
    width: auto;
    transition: background .15s ease;
  }
  .nav-play:hover {
    background: rgba(0,0,0,.50);
  }
  
  .nav-btn:hover { background: rgba(0,0,0,.50); }
  
  @media (min-width: 768px) {
    .nav-prev { left: 2rem; }
    .nav-next { right: 2rem; }
  }
  </style>