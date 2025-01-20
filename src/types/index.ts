export type EntityData = {
  id: string
  name: string
  texture: string
  category: EntityCategory
  layer: EntityLayer
  size: [number, number]
  cost: number | null
  requiredLevel: number
  buildTime: number
  collectionTime: number | null
  currencyValue: number | null
  xpValue: number | null
}
export type MapData = {
  id: string
  name: string
  size: number
  mapEntities: Array<MapEntityData>
}
export type MapEntityData = {
  id: string
  entity: EntityData
  vector: [number, number]
  isFlipped: boolean
  lastCollectedAt: string | null
  createdAt: string
  updatedAt: string
  isPreviewEntity?: boolean
}

export type PlayerData = {
  id: string
  name: string
}

export type EntityCategory = 'buildings' | 'decorations' | 'roads' | 'base'

export type EntityLayer = 'base' | 'ground' | 'object'

export type MapEntitiesByLayer = Record<`${EntityLayer}Layer`, Array<MapEntityData>>

export type Buildables = Record<Exclude<EntityCategory, 'default'>, EntityData[]>

export type DefaultMapEntity = Pick<MapEntityData, 'id' | 'entity' | 'vector'>
