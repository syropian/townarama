<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import GameMap from '@/components/GameMap.vue'
import GameAudio from '@/components/GameAudio.vue'
import BuildMenu from '@/components/build-menu/BuildMenu.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SvgCustomFilters from '@/components/SvgCustomFilters.vue'
import ManageMapsDialog from '@/components/manage-maps-dialog/ManageMapsDialog.vue'
import { useEntitiesStore } from '@/stores/useEntitiesStore'
import { useGameStore } from '@/stores/useGameStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useStorage } from '@/stores/useStorage'
import type { MapData } from '@/types'

const playerStore = usePlayerStore()
const entitiesStore = useEntitiesStore()
const gameStore = useGameStore()
const { storage } = useStorage()
const { activeBuildable, buildables } = storeToRefs(entitiesStore)
const { inDemolitionMode } = storeToRefs(gameStore)

async function createNewMap(mapName: string, tiles: number) {
  const newMap = await playerStore.createNewMap(mapName, tiles)
  await playerStore.setCurrentMapId(newMap.id)
}

async function loadMap(mapId: string) {
  entitiesStore.$reset()
  gameStore.inDemolitionMode = false
  await playerStore.setCurrentMapId(mapId)
}

function renameMap(mapId: string, newName: string) {
  playerStore.renameMap(mapId, newName)
}

function deleteMap(mapId: string) {
  if (playerStore.maps.length <= 1) return

  playerStore.deleteMap(mapId)
}

onBeforeMount(async () => {
  const currentMapId = (await storage.getItem('currentMapId')) as string
  const existingsMaps = ((await storage.getItem('maps')) as MapData[]) ?? []

  if (existingsMaps.length) {
    playerStore.maps = existingsMaps
    if (currentMapId) {
      await playerStore.setCurrentMapId(currentMapId)
    }
  } else {
    const newMap = await playerStore.createNewMap('New Townsville')
    await playerStore.setCurrentMapId(newMap.id)
  }
})
</script>

<template>
  <div class="relative flex h-dvh w-screen flex-col items-center justify-center overflow-x-hidden bg-cyan-600">
    <!-- <GameAudio /> -->
    <SvgCustomFilters />
    <div class="fixed top-8 left-0 flex w-full items-center justify-center">
      <p
        v-if="playerStore.currentMapId"
        class="font-display ring-inset-amber-300 flex items-center justify-center gap-x-4 rounded-full border-4 border-amber-800 bg-gradient-to-t from-amber-400 to-amber-300 px-8 py-3 text-xl text-amber-800 ring-4 shadow-lg ring-amber-200 ring-offset-2 ring-offset-amber-500 ring-inset"
      >
        {{ playerStore.currentMap.name }}
      </p>
    </div>
    <GameMap
      v-if="playerStore.maps.length && playerStore.currentMapId"
      :key="playerStore.currentMapId"
      :style="{ scale: 1 }"
    />
    <div class="fixed bottom-0 left-0 z-10 flex w-full items-center gap-x-4 p-16">
      <BuildMenu
        :buildables="buildables"
        @click="inDemolitionMode = false"
      />
      <BaseButton
        v-if="activeBuildable"
        class="aspect-square h-20 w-20"
        @click="activeBuildable = null"
      >
        <div>
          <span class="sr-only">Exit build mode</span
          ><span
            role="presentation"
            class="text-2xl"
            >❌</span
          >
        </div>
      </BaseButton>
      <BaseButton
        v-if="inDemolitionMode && !activeBuildable"
        class="aspect-square h-20 w-20"
        @click="inDemolitionMode = false"
      >
        <div>
          <span class="sr-only">Exit demolition mode</span
          ><span
            role="presentation"
            class="text-2xl"
            >❌</span
          >
        </div>
      </BaseButton>
      <BaseButton
        v-else-if="!inDemolitionMode && !activeBuildable"
        class="aspect-square h-20 w-20"
        @click="inDemolitionMode = true"
        :disabled="Boolean(activeBuildable)"
      >
        <div>
          <span class="sr-only">Enter demolition mode</span
          ><span
            role="presentation"
            class="text-5xl text-amber-700 drop-shadow-[0_1px_0px_var(--color-amber-300)]"
            ><Icon icon="game-icons:unlit-bomb"
          /></span>
        </div>
      </BaseButton>
      <ManageMapsDialog
        @create-map="createNewMap"
        @load-map="loadMap"
        @rename-map="renameMap"
        @delete-map="deleteMap"
      />
    </div>
  </div>
</template>
