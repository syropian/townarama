import type { DefaultMapEntity, EntityData, MapEntityData } from '@/types'
import { getEntityAtVector } from '@/utils/entities'
import { generateUuid } from '@/utils'

export function generateMapTiles(initialEntities: MapEntityData[], mapSize: number): Array<MapEntityData> {
  return Array.from({ length: mapSize ** 2 }).map((_, tileIndex) => {
    const vector = tileIndexToVector(tileIndex, mapSize)
    // TODO: Fix this to check base entities only
    const existingEntity = getEntityAtVector(initialEntities, vector)

    const defaultMapEntity: DefaultMapEntity = {
      id: generateUuid(),
      entity: {
        id: 'grass-1',
        texture: 'base/grass/grass.png',
        category: 'base',
        layer: 'base',
        size: [1, 1],
      } as EntityData,
      vector,
    }

    return existingEntity ?? { ...(defaultMapEntity as MapEntityData) }
  })
}

export function tileIndexToVector(index: number, mapSize: number): Vec2D {
  return [index % mapSize, Math.floor(index / mapSize)]
}
