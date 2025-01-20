import localForage from 'localforage'
import { usePlayerStore } from '@/stores/usePlayerStore'

localForage.config({
  name: 'Townarama',
  storeName: 'townarama_db_v1.0',
})
export function useStorage() {
  async function syncMapsToStorage() {
    const playerStore = usePlayerStore()
    localForage.setItem('maps', JSON.parse(JSON.stringify(playerStore.maps)))
  }
  return {
    storage: localForage,
    syncMapsToStorage,
  }
}
