<script setup lang="ts">
import { computed } from 'vue'
import { SKEWED_TILE_WIDTH, SKEWED_TILE_HEIGHT } from '@/constants/game'
import type { MapEntityData } from '@/types'

const props = defineProps<{
  entity: MapEntityData | undefined
}>()

const emit = defineEmits<{
  tileSelected: [entity: MapEntityData | undefined]
  tileHovered: [entity: MapEntityData | undefined]
}>()

const isGrassEntity = computed(() => {
  return !props.entity
})

function handleMouseOver() {
  if (!isGrassEntity.value) {
    emit('tileHovered', props.entity as MapEntityData)
  } else {
    emit('tileHovered', undefined)
  }
}
</script>

<template>
  <button
    type="button"
    class="group relative inline-flex aspect-square items-center justify-center rounded-sm outline-none select-none"
    :class="{
      '!text-transparent': true,
      'border border-green-900': false,
    }"
    :style="{
      width: `${SKEWED_TILE_WIDTH}px`,
      height: `${SKEWED_TILE_WIDTH}px`,
      top: '-6px',
      left: '-6px',
    }"
    @click="$emit('tileSelected', entity)"
    @mouseover="handleMouseOver"
  >
    <div
      v-if="isGrassEntity"
      class="absolute h-full w-full scale-10 rounded-full bg-green-950/20 opacity-0 transition group-hover:scale-40 group-hover:opacity-100"
    ></div>
    <slot />
  </button>
</template>
