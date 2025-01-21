<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'radix-vue'
import { Icon } from '@iconify/vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CreateMapForm from '@/components/manage-maps-dialog/CreateMapForm.vue'
import { usePlayerStore } from '@/stores/usePlayerStore'
import MapSelectMenu from './MapSelectMenu.vue'

const emit = defineEmits<{
  createMap: [name: string, tiles: number]
  loadMap: [mapId: string]
  deleteMap: [mapId: string]
  renameMap: [mapId: string, newName: string]
}>()

const playerStore = usePlayerStore()

function handleCreateMap(name: string, tiles: number) {
  emit('createMap', name, tiles)
}

function handleLoadMap(mapId: string) {
  emit('loadMap', mapId)
}

function handleRenameMap(mapId: string, newName: string) {
  emit('renameMap', mapId, newName)
}

function handleDeleteMap(mapId: string) {
  emit('deleteMap', mapId)
}
</script>

<template>
  <DialogRoot>
    <DialogTrigger :as-child="true">
      <BaseButton class="ml-auto aspect-square h-20 w-20">
        <span
          role="presentation"
          class="text-5xl text-amber-700 drop-shadow-[0_1px_0px_var(--color-amber-300)]"
          ><Icon icon="ion:earth"
        /></span>
      </BaseButton>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-30 bg-black/75 opacity-0 backdrop-blur-xs transition-opacity transition-discrete data-[state=open]:opacity-100 starting:data-[state=open]:opacity-0"
      />
      <DialogContent
        class="fixed top-[50%] left-[50%] z-[100] w-[90vw] max-w-3xl -translate-x-1/2 translate-y-[calc(-1*50%+75px)] rounded-3xl shadow-lg transition-transform transition-discrete duration-500 ease-[cubic-bezier(0.25,_1.8,_0.25,_1)] focus:outline-none data-[state=open]:-translate-y-1/2 starting:data-[state=open]:translate-y-[calc(-1*50%+75px)]"
      >
        <div
          class="h-full max-h-[85dvh] overflow-x-hidden overflow-y-auto rounded-3xl border-8 border-amber-800 bg-amber-500 p-6"
        >
          <DialogTitle class="sr-only m-0 text-center text-2xl font-bold text-black">
            Create or load a town
          </DialogTitle>
          <ul class="mt-8 flex w-full flex-col justify-start gap-y-8">
            <li>
              <CreateMapForm @submit="handleCreateMap" />
            </li>
            <li
              role="separator"
              class="flex w-full items-center text-2xl font-bold text-amber-900 [text-shadow:0_1px_1px_var(--color-amber-400)] before:h-px before:flex-1 before:bg-amber-700 before:shadow-[0_1px_1px_var(--color-amber-400)] after:h-px after:flex-1 after:bg-amber-700 after:shadow-[0_1px_1px_var(--color-amber-400)]"
            >
              <span class="px-4">Existing towns</span>
            </li>
            <li
              v-for="map in playerStore.maps"
              :key="map.id"
            >
              <MapSelectMenu
                :map="map"
                :can-delete="playerStore.maps.length > 1"
                @load-map="handleLoadMap"
                @rename-map="handleRenameMap"
                @delete-map="handleDeleteMap"
              />
            </li>
          </ul>
          <p
            class="w-full px-4 pt-12 text-center text-xs font-extrabold tracking-wider text-amber-800 uppercase [text-shadow:0_1px_1px_var(--color-amber-400)]"
          >
            Made with <span class="text-red-500">&hearts;</span> by
            <a
              href="https://syropia.net"
              target="_blank"
              rel="noopener noreferrer"
              class="underline decoration-wavy transition-colors hover:text-amber-900"
              >Collin Henderson</a
            >. Graphics created by
            <a
              href="https://www.penzilladesign.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="underline decoration-wavy transition-colors hover:text-amber-900"
              >Penzilla Design</a
            >
          </p>
        </div>
        <DialogClose
          class="font-display absolute -top-5 -right-4 z-20 flex aspect-square w-10 items-center justify-center rounded-full border-4 border-amber-300 bg-amber-400 text-amber-900 ring-4 ring-amber-800 ring-offset-2 ring-offset-amber-500 transition-transform outline-none hover:scale-105 hover:bg-amber-500"
          aria-label="Close"
        >
          <Icon icon="ion:close-round" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
