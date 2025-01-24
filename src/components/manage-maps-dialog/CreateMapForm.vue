<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { DialogClose } from 'radix-vue'
import AutoHeight from '@/components/ui/AutoHeight.vue'

const DEFAULT_SIZE = 7
const MIN_SIZE = 3
const MAX_SIZE = 20

const emit = defineEmits<{
  submit: [name: string, tiles: number]
}>()

const isNewMapFormShowing = ref(false)
const newMapName = ref('')
const newMapNameInput = ref<HTMLInputElement | null>(null)
const newMapTiles = ref(DEFAULT_SIZE)

watch(isNewMapFormShowing, isShowing => {
  if (isShowing && newMapNameInput.value) {
    newMapNameInput.value.focus()
  }
})

function handleTileNumberChange() {
  if (newMapTiles.value < MIN_SIZE) newMapTiles.value = MIN_SIZE
  if (newMapTiles.value > MAX_SIZE) newMapTiles.value = MAX_SIZE
}

function toggleMapForm() {
  isNewMapFormShowing.value = !isNewMapFormShowing.value

  setTimeout(() => {
    if (!isNewMapFormShowing.value) {
      newMapName.value = ''
      newMapTiles.value = DEFAULT_SIZE
    }
  }, 300)
}

function handleCreateNewMap() {
  handleTileNumberChange()

  nextTick().then(() => {
    emit('submit', newMapName.value.trim(), newMapTiles.value)
  })
}
</script>
<template>
  <div>
    <button
      type="button"
      class="font-display ring-inset-amber-300 flex w-full items-center justify-center gap-x-4 rounded-xl border-4 border-amber-800 bg-amber-400 p-8 text-green-900 ring-4 shadow-lg ring-amber-300 ring-offset-2 ring-offset-amber-500 transition-transform outline-none ring-inset hover:scale-105 hover:bg-gradient-to-t hover:from-amber-400 hover:to-amber-300 hover:ring-amber-200"
      @click="toggleMapForm"
    >
      <span
        role="presentation"
        class="text-5xl transition-transform duration-500"
        :class="isNewMapFormShowing ? 'rotate-[225deg]' : 'rotate-0'"
        ><Icon icon="ion:add-circle"
      /></span>
      <span class="text-5xl">Create a new town</span>
    </button>
    <AutoHeight
      :show="isNewMapFormShowing"
      :fade="true"
    >
      <div class="pt-6 pb-2">
        <div class="mt-4 flex items-stretch justify-start gap-x-4">
          <div class="flex flex-1 flex-col gap-y-1">
            <label
              for="townName"
              class="text-xl font-bold text-amber-800 [text-shadow:0_1px_1px_var(--color-amber-400)]"
            >
              Give your town a name
            </label>
            <input
              ref="newMapNameInput"
              type="text"
              id="townName"
              v-model="newMapName"
              class="w-full min-w-0 flex-1 rounded-xl bg-amber-300 p-1 pl-3 text-xl text-amber-800 outline-none focus:bg-amber-200"
              placeholder="New Townsville"
              autofocus
            />
          </div>
          <div class="flex flex-col gap-y-1">
            <label
              for="tileCount"
              class="text-xl font-bold text-amber-800 [text-shadow:0_1px_1px_var(--color-amber-400)]"
            >
              How many tiles?
            </label>
            <div class="flex items-center justify-start gap-x-4">
              <input
                type="number"
                id="tileCount"
                v-model="newMapTiles"
                min="3"
                max="20"
                @change="handleTileNumberChange"
                class="min-w-0 rounded-xl bg-amber-300 p-1 pl-3 text-5xl text-amber-800 outline-none"
              />
              <Icon
                icon="ion:close-round"
                class="text-amber-900"
              />
              <input
                type="number"
                readonly
                :value="newMapTiles"
                min="3"
                max="20"
                class="min-w-0 cursor-not-allowed rounded-xl bg-amber-300 p-1 pl-3 text-5xl text-amber-800 opacity-75 outline-none"
              />
            </div>
          </div>
        </div>
        <DialogClose :as-child="true">
          <button
            class="font-display relative mt-4 flex w-full items-center justify-center rounded-xl border-4 border-green-700 bg-green-800 px-8 py-3 text-2xl tracking-wider text-white transition-opacity [text-shadow:0_-1px_1px_var(--color-green-900)] outline-none hover:border-green-600 hover:bg-green-700 active:top-px disabled:pointer-events-none disabled:opacity-50"
            @click="handleCreateNewMap"
            :disabled="!newMapName.trim()"
            type="button"
          >
            Start building!
          </button>
        </DialogClose>
      </div>
    </AutoHeight>
  </div>
</template>
