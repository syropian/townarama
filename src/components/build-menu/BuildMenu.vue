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
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'radix-vue'
import { Icon } from '@iconify/vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useEntitiesStore } from '@/stores/useEntitiesStore'
import { getEntityDefaultTexture } from '@/utils/entities'
import type { Buildables, EntityData } from '@/types'

type TabValue = keyof Buildables
type Tab = { label: string; value: TabValue }

const props = defineProps<{
  buildables: Buildables
}>()

defineEmits<{
  click: () => void
}>()

const activeTab = ref<keyof Buildables>('buildings')

const entitiesStore = useEntitiesStore()
const { activeBuildable } = storeToRefs(entitiesStore)

const tabs = ref<Tab[]>([
  { label: '🏠', value: 'buildings' },
  { label: '🌳', value: 'decorations' },
  { label: '🛣️', value: 'roads' },
])

function getBuildablesForTab(tab: TabValue): Record<string, EntityData[]> {
  return props.buildables[tab]
    .flatMap(buildable => {
      if (buildable?.variants) {
        return buildable.variants.map((variant, index) => {
          return {
            ...buildable,
            id: `${buildable.id}-${index + 1}`,
            name: `${buildable.name} ${index + 1}`,
            defaultVariant: variant,
            variants: undefined,
          }
        })
      }

      return buildable
    })
    .reduce(
      (acc, curr) => {
        if (curr.subcategory) {
          acc[curr.subcategory] = [...(acc[curr.subcategory] ?? []), curr]
        } else {
          acc['none'] = [...(acc['none'] ?? []), curr]
        }

        return acc
      },
      {} as Record<string, EntityData[]>
    )
}
</script>
<template>
  <PopoverRoot :modal="true">
    <PopoverTrigger
      :as="BaseButton"
      class="aspect-square h-20 w-20"
      @click="$emit('click')"
    >
      <div v-if="!activeBuildable.entity">
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
        <span class="sr-only">{{ activeBuildable.entity.name }}</span
        ><img
          :src="getEntityDefaultTexture(activeBuildable.entity)"
          :alt="activeBuildable.entity.name"
          class="h-18 w-18 object-contain"
        />
      </div>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="top"
        align="start"
        :side-offset="12"
        class="relative z-10 max-w-lg overflow-hidden overflow-y-auto rounded-xl border-4 border-amber-800 bg-amber-500 p-1 shadow-lg"
      >
        <TabsRoot v-model="activeTab">
          <TabsList class="flex items-center gap-x-1">
            <TabsTrigger
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              :aria-label="tab.value"
              class="relative aspect-square rounded-t-lg p-3 text-6xl data-[state=active]:z-20 data-[state=active]:bg-amber-50 data-[state=inactive]:bg-amber-200"
              >{{ tab.label }}</TabsTrigger
            >
          </TabsList>
          <TabsContent
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            class="relative z-10"
          >
            <div
              class="max-h-96 space-y-6 overflow-y-auto rounded-xl rounded-tl-none bg-amber-50 p-4 shadow-[0_-1px_3px_rgba(0,0,0,0.13)]"
            >
              <div
                v-for="(buildables, category) in getBuildablesForTab(tab.value)"
                :key="category"
              >
                <h4
                  class="text-brown mb-3 font-bold text-amber-800 first-letter:uppercase"
                  v-if="category !== 'none'"
                >
                  {{ category }}
                </h4>
                <div class="grid grid-cols-4 gap-4">
                  <PopoverClose
                    v-for="buildable in buildables"
                    :key="buildable.id"
                    type="button"
                    class="inline-flex flex-col items-center gap-y-2 rounded bg-white px-2 py-1 text-amber-800 ring-2 shadow-md ring-amber-800/30 transition-shadow hover:shadow-lg hover:ring-amber-600"
                    @click="activeBuildable.entity = buildable"
                  >
                    <img
                      :src="getEntityDefaultTexture(buildable)"
                      class="h-20 w-20 object-contain"
                      lazy
                    />
                    <span class="mt-auto text-sm font-semibold">{{ buildable.name }}</span>
                  </PopoverClose>
                </div>
              </div>
            </div>
          </TabsContent>
        </TabsRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
