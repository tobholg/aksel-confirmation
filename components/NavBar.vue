<template>
  <!-- wrapper (overlay lives in same component) -->
  <div>
    <!-- top‑nav -->
    <header
      class="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-center px-4 text-white"
    >
      <!-- BLUR‑GRADIENT overlay (pointer‑events‑none so it never blocks clicks) -->
      <div
        class="absolute inset-0 pointer-events-none"/>

      <!-- menu button -->
      <button
        class="absolute left-4 font-semibold text-sm sm:text-base px-4 py-1.5 backdrop-blur-sm bg-black/30 hover:bg-black/40 rounded-lg transition text-white"
        aria-label="Åpne / lukk meny"
        @click="toggle"
      >
        Meny
      </button>

      <!-- centred title -->
      <h1 v-if="false" class="font-semibold text-base tracking-wide text-white">
        Konfirmasjon&nbsp;Aksel&nbsp;2025
      </h1>
    </header>

    <!-- fullscreen overlay -->
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50
               flex flex-col items-center justify-center
               backdrop-blur-lg bg-black/60"
        @click.self="close"
      >
        <ul class="space-y-6 text-center">
          <li>
            <NuxtLink
              to="/"
              class="text-xl md:text-2xl font-semibold text-white hover:text-neutral-400 transition"
              @click="close"
            >
              Hjem
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/toppturer"
              class="text-xl md:text-2xl font-semibold text-white hover:text-neutral-400 transition"
              @click="close"
            >
              Toppturer
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/aksel"
              class="text-xl md:text-2xl font-semibold text-white hover:text-neutral-400 transition"
              @click="close"
            >
              Aksel
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/hmm"
              class="text-xl md:text-2xl font-semibold text-white hover:text-neutral-400 transition"
              @click="close"
            >
              🐸
            </NuxtLink>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/* --- state --------------------------------------------------------------- */
const open = ref(false)

/* --- helpers ------------------------------------------------------------- */
function toggle() {
  open.value = !open.value
}
function close() {
  open.value = false
}
</script>

<style>
/* fade for the menu overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>