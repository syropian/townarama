<script setup lang="ts">
import { computed } from 'vue'
import { TILE_HEIGHT, TILE_WIDTH } from '@/constants/game'
import { isPreviewEntity } from '@/utils/entities'
import type { MapEntityData } from '@/types'

const props = defineProps<{
  mapEntity: MapEntityData
  canPlaceEntity?: boolean
}>()

const [cols, rows] = props.mapEntity.entity.size
const [x, y] = props.mapEntity.vector

const size = computed<Vec2D>(() => {
  const entityWidth = TILE_WIDTH * ((cols + rows) / 2)
  const entityHeight = TILE_HEIGHT * ((cols + rows) / 2)

  return [entityWidth, entityHeight]
})

const position = computed<Vec2D>(() => {
  const entityCols = props.mapEntity.isFlipped ? rows : cols
  const entityRows = props.mapEntity.isFlipped ? cols : rows

  const offsetLeft = size.value[0] / 2 + ((TILE_WIDTH / 2) * (entityRows - entityCols)) / 2

  const isoLeft = (x - y) * (TILE_WIDTH / 2) - offsetLeft
  const isoTop = (x + y) * (TILE_HEIGHT / 2) + TILE_HEIGHT / 2

  return [isoLeft, isoTop]
})

const entityFilter = computed(() => {
  if (isPreviewEntity(props.mapEntity)) {
    if (props.canPlaceEntity) {
      return 'url(#duotone-valid)'
    } else {
      return 'url(#duotone-invalid)'
    }
  }

  return ''
})
</script>

<template>
  <div
    class="absolute flex h-auto justify-center"
    :style="{
      width: `${size[0]}px`,
      height: `${size[1]}px`,
      left: `${position[0]}px`,
      top: `${position[1]}px`,
      opacity: 1,
    }"
    :class="{
      '-scale-x-[1] backface-hidden': mapEntity.isFlipped,
    }"
  >
    <img
      :src="`/img/textures/${mapEntity.entity.texture}`"
      class="absolute h-auto w-full"
      :style="{
        bottom: `-${(x + y + 1) * 0.4}px`,
        left: `${(y - (x + 1)) * 0.4}px`,
        filter: entityFilter,
      }"
    />
  </div>
</template>
