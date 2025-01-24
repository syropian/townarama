<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useEntitiesStore } from '@/stores/useEntitiesStore'

defineEmits<{
  change: [color: string]
}>()

const entitiesStore = useEntitiesStore()
const { activeBuildable } = storeToRefs(entitiesStore)
</script>
<template>
  <PopoverRoot
    :modal="true"
    v-if="activeBuildable.entity?.availableColors"
  >
    <PopoverTrigger
      :as="BaseButton"
      class="aspect-square h-20 w-20"
    >
      <div
        class="aspect-square h-8 w-8 rounded-full border-2 border-black"
        :style="{ backgroundColor: activeBuildable.selectedColor ?? activeBuildable.entity.defaultColor }"
      >
        <span class="sr-only">Selected color</span>
      </div>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="top"
        align="start"
        :side-offset="12"
        class="group flex max-w-md items-center gap-x-1"
      >
        <PopoverClose
          v-for="(color, i) in activeBuildable.entity?.availableColors"
          :key="color"
          type="button"
          @click="$emit('change', color)"
          class="rounded-full transition-transform hover:scale-115"
        >
          <span class="sr-only">{{ color }}</span>
          <div
            role="presentation"
            class="h-8 w-8 translate-y-2 rounded-full border-2 border-black opacity-0 shadow-md transition transition-discrete duration-200 group-data-[state=open]:translate-y-0 group-data-[state=open]:opacity-100 starting:group-data-[state=open]:translate-y-2 starting:group-data-[state=open]:opacity-0"
            :style="{
              backgroundColor: color ?? 'transparent',
              'transition-delay': `${i * 50}ms`,
            }"
          ></div
        ></PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
