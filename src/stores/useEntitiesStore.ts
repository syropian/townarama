import { defineStore } from 'pinia'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useGameStore } from '@/stores/useGameStore'
import { generateUuid } from '@/utils'
import { getEntityAtVector, isPreviewEntity } from '@/utils/entities'
import { ALL_ENTITIES } from '@/constants/entities'
import type { Buildables, EntityData, MapEntitiesByLayer, MapEntityData } from '@/types'
import { useStorage } from './useStorage'

type EntitiesStoreState = {
  activeBuildable: EntityData | null
  activeBuildableIsFlipped: boolean
}
export const useEntitiesStore = defineStore('entities', {
  state: () =>
    ({
      activeBuildable: null,
      activeBuildableIsFlipped: false,
    }) as EntitiesStoreState,
  getters: {
    buildables(): Buildables {
      type BuildableKeys = keyof Buildables

      return ALL_ENTITIES.reduce(
        (acc, entity) => {
          if (entity.cost !== null && acc[entity.category as BuildableKeys]) {
            acc[entity.category as BuildableKeys].push(entity)
          }

          return acc
        },
        {
          base: [],
          buildings: [],
          decorations: [],
          roads: [],
        } as Buildables
      )
    },
    buildablePreviewEntity(state): MapEntityData | null {
      if (!state.activeBuildable) return null

      return this.currentMapEntities[`${state.activeBuildable.layer}Layer`].find(isPreviewEntity) ?? null
    },
    buildablePreviewEntityVectors(state): Vec2D[] {
      if (!this.buildablePreviewEntity || !state.activeBuildable) return []

      const {
        size: [cols, rows],
      } = state.activeBuildable
      const entityCols = state.activeBuildableIsFlipped ? rows : cols
      const entityRows = state.activeBuildableIsFlipped ? cols : rows
      const { vector } = this.buildablePreviewEntity

      return Array.from({ length: entityCols }).flatMap((_, x) =>
        Array.from({ length: entityRows }).map((_, y) => [vector[0] + x, vector[1] + y] as Vec2D)
      )
    },
    currentMapEntities(state): MapEntitiesByLayer {
      const playerStore = usePlayerStore()
      const gameStore = useGameStore()
      const mapEntities = [...playerStore.currentMap.mapEntities]
      if (state.activeBuildable && gameStore?.currentVector) {
        mapEntities.push({
          id: generateUuid(),
          entity: state.activeBuildable,
          vector: useGameStore().currentVector ?? [0, 0],
          isFlipped: state.activeBuildableIsFlipped,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          lastCollectedAt: null,
          isPreviewEntity: true,
        })
      }
      return {
        baseLayer: [],
        groundLayer: [],
        objectLayer: [],
        ...Object.groupBy(mapEntities, entity => `${entity.entity.layer}Layer`),
      } as MapEntitiesByLayer
    },
    sortedEntities(): MapEntityData[] {
      return this.currentMapEntities.objectLayer.toSorted((a, b) => {
        const aDepth = a.vector[0] + a.vector[1] + a.entity.size[0] + a.entity.size[1]
        const bDepth = b.vector[0] + b.vector[1] + b.entity.size[0] + b.entity.size[1]

        if (aDepth !== bDepth) {
          return aDepth - bDepth
        }

        if (a.vector[1] !== b.vector[1]) {
          if (a.entity.size[1] > a.entity.size[0]) {
            return b.vector[1] - a.vector[1]
          }

          return a.vector[1] - b.vector[1]
        }

        if (b.isPreviewEntity) {
          return b.vector[0] - (a.vector[0] + 1)
        }
        return a.vector[0] - b.vector[0]
      })
    },
    canPlaceActiveBuildable(state): boolean {
      if (!state.activeBuildable || !this.buildablePreviewEntity || !this.buildablePreviewEntityVectors.length)
        return false

      const playerStore = usePlayerStore()

      return (
        !this.buildablePreviewEntityVectors.some(vec =>
          Boolean(getEntityAtVector(playerStore.currentMap.mapEntities, vec))
        ) &&
        this.buildablePreviewEntityVectors.every(
          ([x, y]) => x >= 0 && y >= 0 && x < playerStore.currentMap.size && y < playerStore.currentMap.size
        )
      )
    },
  },
  actions: {
    getMapEntityAtVector(vec: Vec2D): MapEntityData | undefined {
      return getEntityAtVector([...this.currentMapEntities.objectLayer, ...this.currentMapEntities.baseLayer], vec)
    },
    async addEntity(mapEntity: MapEntityData) {
      if (!this.canPlaceActiveBuildable) return
      const { syncMapsToStorage } = useStorage()
      const playerStore = usePlayerStore()
      playerStore.setCurrentMapEntities([...playerStore.currentMap.mapEntities, mapEntity])
      await syncMapsToStorage()
    },
    async removeEntity(mapEntity: MapEntityData) {
      const playerStore = usePlayerStore()
      const { syncMapsToStorage } = useStorage()

      playerStore.setCurrentMapEntities(playerStore.currentMap.mapEntities.filter(entity => entity.id !== mapEntity.id))
      await syncMapsToStorage()
    },
  },
})
