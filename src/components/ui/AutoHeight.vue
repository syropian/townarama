<template>
  <div
    class="overflow-hidden transition-all duration-300"
    :style="{
      height,
      opacity: fade ? (show ? 1 : 0) : 1,
    }"
    ref="content"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const props = withDefaults(defineProps<{ show: boolean; fade?: boolean }>(), {
  fade: true,
})

const content = ref<HTMLDivElement | null>(null)
const height = ref<string>('0px')

useResizeObserver(content, () => {
  if (!props.show) return

  height.value = `${getContentHeight()}px`
})

onMounted(() => {
  if (!props.show) return

  height.value = `${getContentHeight()}px`
})

watch(
  () => props.show,
  isShowing => {
    if (isShowing) {
      nextTick().then(() => {
        height.value = `${getContentHeight()}px`
      })
    } else {
      height.value = '0px'
    }
  }
)

function getContentHeight() {
  if (!content.value) return 1

  const style = window.getComputedStyle(content.value)
  let baseHeight = content.value.scrollHeight

  baseHeight += parseInt(style.marginTop) + parseInt(style.marginBottom)

  return baseHeight
}
</script>
