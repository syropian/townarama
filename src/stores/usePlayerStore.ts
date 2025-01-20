import { defineStore } from 'pinia'
import { generateUuid, vecsAreEqual } from '@/utils'
import { isNotPreviewEntity, isPreviewEntity } from '@/utils/entities'
import type { MapData, MapEntityData } from '@/types'
import { useStorage } from './useStorage'

type PlayerStoreState = {
  currentMapId: string | null
  maps: MapData[]
}
export const usePlayerStore = defineStore('player', {
  state: () =>
    ({
      maps: [],
      currentMapId: null,
    }) as PlayerStoreState,
  getters: {
    currentMap(state): MapData {
      return state.maps.find(map => map.id === state.currentMapId) as MapData
    },
  },
  actions: {
    async createNewMap(name: string, size: number = 7): Promise<MapData> {
      const { syncMapsToStorage } = useStorage()
      const newMap = {
        id: generateUuid(),
        name,
        size,
        mapEntities: [],
      }

      this.maps.push(newMap)
      await syncMapsToStorage()

      return newMap
    },
    async setCurrentMapId(mapId: string) {
      const { storage } = useStorage()
      this.currentMapId = mapId
      await storage.setItem('currentMapId', mapId)
    },
    setCurrentMapEntities(mapEntities: MapEntityData[]) {
      this.maps = this.maps.map(gameMap => {
        if (gameMap.id === this.currentMapId) {
          gameMap.mapEntities = mapEntities
        }

        return gameMap
      })
    },
    async renameMap(mapId: string, newName: string) {
      const { syncMapsToStorage } = useStorage()

      this.maps = this.maps.map(gameMap => {
        if (gameMap.id === mapId) {
          return {
            ...gameMap,
            name: newName,
          }
        }

        return gameMap
      })
      await syncMapsToStorage()
    },
    async deleteMap(mapId: string) {
      const { syncMapsToStorage } = useStorage()

      if (mapId === this.currentMapId) {
        // Find the new id to set as the current map
        const newCurrentMap = this.maps.find(gameMap => gameMap.id !== mapId)

        if (!newCurrentMap) {
          throw new Error('Deleting map failed: No other maps found')
        }

        this.setCurrentMapId(newCurrentMap.id)
      }
      this.maps = this.maps.filter(gameMap => gameMap.id !== mapId)
      await syncMapsToStorage()
    },
  },
})
