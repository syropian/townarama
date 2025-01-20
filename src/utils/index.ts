export function degreesToRads(deg: number) {
  return (deg * Math.PI) / 180.0
}
export function vecsAreEqual(vecA: Vec2D, vecB: Vec2D) {
  return vecA[0] === vecB[0] && vecA[1] === vecB[1]
}

export function generateUuid() {
  // Generate a valid uuid
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
