<template>
  <router-view />
</template>

<script setup>
import { web } from 'boot/axios'
import { onMounted } from 'vue'

defineOptions({
  name: 'App'
})

onMounted(() => {
  web.get('sanctum/csrf-cookie')
})
</script>
