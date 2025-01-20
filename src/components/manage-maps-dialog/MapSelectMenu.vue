<script setup lang="ts">
import { ref } from 'vue'
import { DialogClose } from 'radix-vue'
import { Icon } from '@iconify/vue'
import AutoHeight from '@/components/ui/AutoHeight.vue'
import type { MapData } from '@/types'

const props = defineProps<{
  map: MapData
  canDelete: boolean
}>()

const emit = defineEmits<{
  loadMap: [mapId: string]
  deleteMap: [mapId: string]
  renameMap: [mapId: string, newName: string]
}>()

const areMapActionsShowing = ref(false)

function toggleMapForm() {
  areMapActionsShowing.value = !areMapActionsShowing.value
}

function handleRenameMap() {
  const newName = prompt('Enter a new name for your town:', props.map.name)

  if (newName) {
    emit('renameMap', props.map.id, newName)
  }
}

function handleDeleteMap() {
  if (confirm('Are you sure you want to delete this town?')) {
    emit('deleteMap', props.map.id)
  }
}
</script>
<template>
  <div>
    <button
      type="button"
      class="font-display ring-inset-amber-300 flex w-full items-center justify-center gap-x-4 rounded-xl border-4 border-amber-800 bg-amber-400 p-8 text-amber-800 ring-4 shadow-lg ring-amber-300 ring-offset-2 ring-offset-amber-500 transition-transform outline-none ring-inset hover:scale-105 hover:bg-gradient-to-t hover:from-amber-400 hover:to-amber-300 hover:ring-amber-200"
      @click="toggleMapForm"
    >
      <span class="text-5xl">{{ map.name }}</span>
    </button>
    <AutoHeight
      :show="areMapActionsShowing"
      :fade="true"
    >
      <div class="flex items-center gap-x-4 pt-2 pb-2">
        <DialogClose :as-child="true">
          <button
            class="font-display relative mt-4 inline-flex items-center justify-center rounded-xl border-4 border-green-700 bg-green-800 px-8 py-3 text-2xl tracking-wider text-white transition-opacity [text-shadow:0_-1px_1px_var(--color-green-900)] outline-none hover:border-green-600 hover:bg-green-700 active:top-px disabled:pointer-events-none disabled:opacity-50"
            @click="emit('loadMap', map.id)"
            type="button"
          >
            Load town
          </button>
        </DialogClose>
        <button
          class="font-display relative mt-4 inline-flex items-center justify-center rounded-xl border-4 border-amber-700 bg-amber-800 px-8 py-3 text-2xl tracking-wider text-white transition-opacity [text-shadow:0_-1px_1px_var(--color-amber-900)] outline-none hover:border-amber-600 hover:bg-amber-700 active:top-px disabled:pointer-events-none disabled:opacity-50"
          @click="handleRenameMap"
          type="button"
        >
          Rename town
        </button>
        <button
          class="font-display relative mt-4 inline-flex items-center justify-center gap-x-2 rounded-xl border-4 border-red-700 bg-red-800 px-8 py-3 text-2xl tracking-wider text-white transition-opacity [text-shadow:0_-1px_1px_var(--color-red-900)] outline-none hover:border-red-600 hover:bg-red-700 active:top-px disabled:pointer-events-none disabled:opacity-50"
          @click="handleDeleteMap"
          :disabled="!canDelete"
          type="button"
        >
          <span
            role="presentation"
            class="relative -top-px text-2xl"
          >
            <Icon icon="ion:trash" />
          </span>
          Delete town
        </button>
      </div>
    </AutoHeight>
  </div>
</template>
