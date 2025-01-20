<script setup lang="ts">
import { onMounted, ref } from 'vue'

const bgMusic = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  if (!bgMusic.value) return
  bgMusic.value.muted = true
  bgMusic.value.volume = 0.2
  bgMusic.value?.play()
})
</script>
<template>
  <audio
    ref="bgMusic"
    src="/sounds/townarama.mp3"
    loop
    preload="auto"
    class="hidden"
  ></audio>
</template>
