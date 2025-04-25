<template>
    <div
      class="h-[100dvh] w-[100dvw] grid items-center content-center justify-center justify-items-center bg-neutral-900 text-white p-3 gap-6"
    >
      <h1 class="text-2xl md:text-3xl font-semibold text-center">
        🎉 Gratulerer med dagen til verdens beste venn og lillebror! 🎉
      </h1>
  
      <p class="text-lg md:text-2xl text-neutral-400 text-center">
        It's dangerous to go alone! Take this:
      </p>
  
      <h3
        class="text-3xl md:text-5xl font-semibold text-center px-6 py-3 rounded-full border border-neutral-700 magical-text"
      >
        10.000 kr. Nintendo-budsjett!
      </h3>
  
      <!-- NEW: celebratory Nintendo image -->
      <img
        src="/nintendo_1.webp"
        alt="Nintendo celebration"
        class="w-56 sm:w-64 md:w-72 lg:w-80 xl:w-[32rem] mx-auto select-none rounded-xl"
        width="384"
        height="230"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  // Nothing special needed here.
  </script>
  
  <style>
  .magical-text {
    color: #00ced1; /* fallback */
    background: linear-gradient(to right, #e60091, #00ced1, #e60091);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 6s linear infinite alternate;
  }
  </style>