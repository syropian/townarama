<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  disabled?: boolean
  size?: 'sm' | 'base'
  variant?: 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'primary',
})

const emit = defineEmits<{
  (e: 'click', value: MouseEvent): void
}>()

const classesForVariant = computed(() => {
  return {
    primary: 'bg-amber-400 shadow-amber-700 active:bg-amber-500',
  }[props.variant || 'primary']
})

const classesForSizeProp = computed(() => {
  return {
    sm: 'px-1.5 py-0.5 text-lg',
    base: 'px-3 py-2 text-xl',
  }[props.size || 'base']
})

const handleClick = (e: MouseEvent) => {
  if (props.disabled) return

  emit('click', e)
}
</script>

<template>
  <button
    :aria-disabled="disabled"
    type="button"
    class="inline-flex items-center justify-center rounded-2xl border-2 border-black font-bold whitespace-nowrap shadow-[inset_0_-4px_0_0] focus-visible:outline-none active:shadow-none"
    :class="[classesForVariant, classesForSizeProp, { 'cursor-not-allowed opacity-60': disabled }]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
