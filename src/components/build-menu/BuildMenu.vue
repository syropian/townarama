<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'radix-vue'
import { Icon } from '@iconify/vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useEntitiesStore } from '@/stores/useEntitiesStore'
import type { Buildables } from '@/types'

defineProps<{
  buildables: Buildables
}>()

defineEmits<{
  click: () => void
}>()

const activeTab = ref('buildings')

const entitiesStore = useEntitiesStore()
const { activeBuildable } = storeToRefs(entitiesStore)
</script>
<template>
  <PopoverRoot :modal="true">
    <PopoverTrigger
      :as="BaseButton"
      class="aspect-square h-20 w-20"
      @click="$emit('click')"
    >
      <div v-if="!activeBuildable">
        <span class="sr-only">Build</span
        ><span
          role="presentation"
          class="text-5xl text-amber-700 drop-shadow-[0_1px_0px_var(--color-amber-300)]"
          ><Icon icon="ion:hammer"
        /></span>
      </div>
      <div
        v-else
        class="flex h-full w-full items-center justify-center"
      >
        <span class="sr-only">{{ activeBuildable.name }}</span
        ><img
          :src="`/img/textures/${activeBuildable.texture}`"
          :alt="activeBuildable.name"
          class="h-12 w-12 object-contain"
        />
      </div>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="top"
        align="start"
        :side-offset="12"
        class="max-w-md overflow-hidden overflow-y-auto rounded-xl bg-amber-50 p-1 shadow-lg"
      >
        <TabsRoot v-model="activeTab">
          <TabsList class="flex items-center gap-x-1">
            <TabsTrigger
              value="buildings"
              class="aspect-square p-3 text-6xl"
              >🏠</TabsTrigger
            >
            <TabsTrigger
              value="decorations"
              class="aspect-square p-3 text-6xl"
              >🌳</TabsTrigger
            >
            <TabsTrigger
              value="roads"
              class="aspect-square p-3 text-6xl"
              >🛣️</TabsTrigger
            >
          </TabsList>
          <TabsContent value="buildings">
            <div class="grid max-h-96 grid-cols-4 gap-4 overflow-y-auto rounded-xl border-2 border-amber-600 p-4">
              <PopoverClose
                v-for="buildable in buildables.buildings"
                :key="buildable.id"
                type="button"
                class="inline-flex flex-col items-center gap-y-2 rounded bg-amber-100 px-2 py-1 text-amber-800 ring-2 ring-amber-400 transition hover:ring-amber-500"
                @click="activeBuildable = buildable"
              >
                <img
                  :src="`/img/textures/${buildable.texture}`"
                  class="h-20 w-20 object-contain"
                  lazy
                />
                <span class="mt-auto text-sm font-semibold">{{ buildable.name }}</span>
              </PopoverClose>
            </div>
          </TabsContent>
          <TabsContent value="decorations">
            <div class="grid max-h-96 grid-cols-4 gap-4 overflow-y-auto rounded-sm border-2 border-amber-600 p-4">
              <PopoverClose
                v-for="buildable in buildables.decorations"
                :key="buildable.id"
                type="button"
                class="inline-flex flex-col items-center gap-y-2 rounded bg-amber-100 px-2 py-1 text-amber-800 ring-2 ring-amber-400 transition hover:ring-amber-500"
                @click="activeBuildable = buildable"
              >
                <img
                  :src="`/img/textures/${buildable.texture}`"
                  class="h-20 w-20 object-contain"
                  lazy
                />
                <span class="mt-auto text-sm font-semibold">{{ buildable.name }}</span>
              </PopoverClose>
            </div>
          </TabsContent>
          <TabsContent value="roads">
            <div class="grid max-h-96 grid-cols-4 gap-4 overflow-y-auto rounded-sm border-2 border-amber-600 p-4">
              <PopoverClose
                v-for="buildable in buildables.roads"
                :key="buildable.id"
                type="button"
                class="inline-flex flex-col items-center gap-y-2 rounded bg-amber-100 px-2 py-1 text-amber-800 ring-2 ring-amber-400 transition hover:ring-amber-500"
                @click="activeBuildable = buildable"
              >
                <img
                  :src="`/img/textures/${buildable.texture}`"
                  class="h-20 w-20 object-contain"
                  lazy
                />
                <span class="mt-auto text-sm font-semibold">{{ buildable.name }}</span>
              </PopoverClose>
            </div>
          </TabsContent>
        </TabsRoot>
      </PopoverContent></PopoverPortal
    >
  </PopoverRoot>
</template>
