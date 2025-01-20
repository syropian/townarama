<script setup lang="ts">
import { computed } from 'vue'
import EntityRenderer from '@/components/EntityRenderer.vue'
import { generateUuid } from '@/utils'
import type { EntityData, MapEntityData } from '@/types'

const props = defineProps<{
  vector: Vec2D
}>()

const entity = computed<MapEntityData>(() => ({
  id: generateUuid(),
  entity: {
    id: 'grass-1',
    texture: 'base/grass/grass.png',
    category: 'base',
    layer: 'base',
    size: [1, 1],
  } as EntityData,
  vector: props.vector,
  isFlipped: false,
  lastCollectedAt: null,
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
}))
</script>
<template>
  <EntityRenderer :map-entity="entity" />
</template>
