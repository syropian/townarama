import { defineStore } from 'pinia'

type GameStoreState = {
  currentVector: Vec2D | null
  inDemolitionMode: boolean
}
export const useGameStore = defineStore('game', {
  state: () =>
    ({
      currentVector: null,
      inDemolitionMode: false,
    }) as GameStoreState,
  getters: {},
  actions: {},
})
