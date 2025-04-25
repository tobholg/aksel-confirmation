<template>
    <div class="h-[100dvh] w-[100dvw] bg-neutral-900 flex items-center justify-center">
      <form class="grid gap-4 w-64" @submit.prevent="handleSubmit">
        <h1 class="text-7xl text-center pb-2 animate-bounce">🐸</h1>
  
        <input
          v-model="password"
          type="password"
          placeholder="Enter the password.."
          class="bg-neutral-700 text-white rounded-full px-4 py-2 placeholder-neutral-400"
          autocomplete="off"
        />
  
        <button
          :disabled="sending"
          class="bg-blue-500 text-white px-5 py-2 rounded-full font-semibold disabled:opacity-50"
        >
          {{ sending ? 'Checking…' : 'Submit' }}
        </button>
  
        <p v-if="error" class="text-red-400 text-center text-sm">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '#app'

const router   = useRouter()
const password = ref('')
const error    = ref<string | null>(null)
const sending  = ref(false)

const SUCCESS_ROUTE = '/k9b8f3d2c1a0e7f6'

const handleSubmit = async () => {
  error.value   = null
  sending.value = true

  try {
    const { data } = await useFetch('/api/verify-password', {
      method: 'POST',
      body: { password: password.value },
    })

    if (data.value?.success) {
      await router.push(SUCCESS_ROUTE)
    } else {
      // show backend-supplied hint if present
      error.value = data.value?.message ?? 'Patience is a virtue.'
    }
  } catch (e) {
    error.value = 'Something went wrong.'
  } finally {
    sending.value = false
  }
}
</script>