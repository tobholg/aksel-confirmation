<template>
  <div>
    <Navbar />        <!-- 🆕 fixed top‑nav / overlay component -->
    <NuxtPage />
    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'
</script>