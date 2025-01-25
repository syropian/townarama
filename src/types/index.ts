export type EntityData = {
  id: string
  name: string
  defaultVariant: string
  defaultColor?: string
  category: EntityCategory
  subcategory: string | null
  layer: EntityLayer
  size: [number, number]
  availableColors?: Array<string>
  variants?: Array<string>
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
  color?: string
  variant?: string
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
