<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { onKeyStroke } from '@vueuse/core'
import EntityRenderer from '@/components/EntityRenderer.vue'
import Tile from '@/components/Tile.vue'
import BaseEntity from '@/components/BaseEntity.vue'
import { useEntitiesStore } from '@/stores/useEntitiesStore'
import { useGameStore } from '@/stores/useGameStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { generateUuid, vecsAreEqual } from '@/utils'
import { isNotPreviewEntity } from '@/utils/entities'
import { tileIndexToVector } from '@/utils/map'
import { TILE_WIDTH, TILE_HEIGHT, SKEWED_TILE_WIDTH } from '@/constants/game'
import type { MapEntityData } from '@/types'

const playerStore = usePlayerStore()

const mapSize = computed(() => {
  return playerStore.currentMap.size
})

const totalTiles = computed(() => {
  return mapSize.value ** 2
})

const entitiesStore = useEntitiesStore()
const gameStore = useGameStore()
const { activeBuildable, buildablePreviewEntity, canPlaceActiveBuildable, currentMapEntities, sortedEntities } =
  storeToRefs(entitiesStore)

watch(activeBuildable, buildable => {
  if (!buildable) {
    activeBuildable.value.isFlipped = false
  } else {
    gameStore.inDemolitionMode = false
  }
})

watch(
  () => activeBuildable.value.isFlipped,
  isFlipped => {
    playerStore.setCurrentMapEntities(
      playerStore.currentMap.mapEntities.map(entity => {
        if (isNotPreviewEntity(entity)) return entity
        return {
          ...entity,
          isFlipped,
        }
      })
    )
  }
)

onKeyStroke(
  'Escape',
  e => {
    gameStore.inDemolitionMode = false
    if (activeBuildable.value) {
      e.preventDefault()
      entitiesStore.clearActiveBuildable()
    }
  },
  { dedupe: true }
)

onKeyStroke(
  ['f', 'F'],
  e => {
    if (activeBuildable.value) {
      e.preventDefault()
      activeBuildable.value.isFlipped = !activeBuildable.value.isFlipped
    }
  },
  { dedupe: true }
)

function getObjectAtTileIndex(index: number): MapEntityData | undefined {
  const [x, y] = tileIndexToVector(index, mapSize.value)

  return entitiesStore.getMapEntityAtVector([x, y])
}

function handleTileHovered(index: number) {
  if (!activeBuildable.value) return

  const vector = tileIndexToVector(index, mapSize.value)

  gameStore.currentVector = vector
}

function handleTileClicked(index: number, mapEntity: MapEntityData | undefined) {
  if (!activeBuildable.value.entity) {
    if (!mapEntity) return
    // look for entities on object layer with matching vector
    if (gameStore.inDemolitionMode) {
      entitiesStore.removeEntity(mapEntity)
    } else {
      console.log('Found object:', mapEntity)
    }

    return
  }
  if (activeBuildable.value.entity && canPlaceActiveBuildable.value) {
    const newEntity: MapEntityData = {
      id: generateUuid(),
      entity: activeBuildable.value.entity,
      vector: tileIndexToVector(index, mapSize.value),
      isFlipped: activeBuildable.value.isFlipped,
      color: activeBuildable.value.selectedColor ?? activeBuildable.value.entity.defaultColor,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      lastCollectedAt: null,
    }
    entitiesStore.addEntity(newEntity)
  }
}

function findBaseEntityAtIndex(index: number) {
  const [x, y] = tileIndexToVector(index, mapSize.value)

  if (
    buildablePreviewEntity.value?.entity.layer === 'base' &&
    vecsAreEqual(buildablePreviewEntity.value.vector, [x, y])
  ) {
    return buildablePreviewEntity.value
  }

  return currentMapEntities.value.baseLayer.find(entity => {
    return vecsAreEqual(entity.vector, [x, y])
  })
}
</script>

<template>
  <div
    class="relative select-none"
    :class="{ 'border-t border-red-500': false }"
    :style="{
      width: `${TILE_WIDTH * mapSize}px`,
      height: `${TILE_HEIGHT * mapSize}px`,
    }"
  >
    <div
      id="entity-layer"
      class="absolute inset-0 translate-x-1/2"
    >
      <div
        id="base-layer"
        class="pointer-events-none absolute inset-0"
      >
        <template
          v-for="tileIndex in totalTiles"
          :key="tileIndex"
        >
          <EntityRenderer
            v-if="findBaseEntityAtIndex(tileIndex - 1)"
            :map-entity="findBaseEntityAtIndex(tileIndex - 1) as MapEntityData"
            :can-place-entity="canPlaceActiveBuildable"
          />
          <BaseEntity
            v-else
            :vector="tileIndexToVector(tileIndex - 1, mapSize)"
          />
        </template>
      </div>

      <div
        id="tile-layer"
        class="preserve-3d absolute z-10 flex flex-wrap backface-hidden"
        :class="{ 'bg-black/50': false }"
        :style="{
          width: `${SKEWED_TILE_WIDTH * mapSize}px`,
          height: `${SKEWED_TILE_WIDTH * mapSize}px`,
          top: `-${6 * mapSize}px`,
          left: `-${(SKEWED_TILE_WIDTH * mapSize) / 2}px`,
          transform: 'rotateX(55deg) rotateZ(45deg)',
        }"
      >
        <Tile
          v-for="tileIndex in mapSize ** 2"
          :key="tileIndex"
          :entity="getObjectAtTileIndex(tileIndex - 1)"
          @tile-hovered="handleTileHovered(tileIndex - 1)"
          @tile-selected="handleTileClicked(tileIndex - 1, $event)"
        >
          {{ tileIndex - 1 }}
        </Tile>
      </div>

      <div
        id="object-layer"
        class="pointer-events-none absolute inset-0 z-10"
      >
        <EntityRenderer
          v-for="tile in sortedEntities"
          :key="tile.id"
          :map-entity="tile"
          :can-place-entity="canPlaceActiveBuildable"
        />
      </div>
    </div>
  </div>
</template>
