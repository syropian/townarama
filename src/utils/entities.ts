import type { EntityData, MapEntityData } from '@/types'

export function getEntityAtVector(mapEntities: MapEntityData[], vec: Vec2D): MapEntityData | undefined {
  const existingMapEntity = mapEntities.find(mapEntity => {
    const [cols, rows] = mapEntity.entity.size
    const entityCols = mapEntity.isFlipped ? rows : cols
    const entityRows = mapEntity.isFlipped ? cols : rows
    const entityEndX = mapEntity.vector[0] + entityCols
    const entityEndY = mapEntity.vector[1] + entityRows

    return vec[0] >= mapEntity.vector[0] && vec[0] < entityEndX && vec[1] >= mapEntity.vector[1] && vec[1] < entityEndY
  })

  if (!existingMapEntity || existingMapEntity?.isPreviewEntity) {
    return undefined
  }

  return existingMapEntity
}

export function isPreviewEntity(entity: MapEntityData): boolean {
  return Object.keys(entity).includes('isPreviewEntity')
}

export function isNotPreviewEntity(entity: MapEntityData): boolean {
  return !isPreviewEntity(entity)
}

export function isGroundTile(entity: EntityData): boolean {
  return entity.texture.includes('grass')
}

export function getOverlappingEntityVectors(mapEntity: MapEntityData): Vec2D[] {
  const {
    vector,
    entity: { size },
  } = mapEntity

  return Array.from({ length: size[0] }).flatMap((_, x) =>
    Array.from({ length: size[1] }).map((_, y) => [vector[0] + x, vector[1] + y] as Vec2D)
  )
}
