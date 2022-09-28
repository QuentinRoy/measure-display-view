import { noOp, Directions } from "./utils.js"

export default function DragControler({
  node,
  direction,
  onDrag = noOp,
  onDragStart = noOp,
  onDragEnd = noOp,
}) {
  let isDragging = false
  let lastPosition = null

  function onPointerDown(evt) {
    if (evt.cancelable) evt.preventDefault()
    if (isDragging) throw new Error(`Already dragging`)
    node.setPointerCapture(evt.pointerId)
    isDragging = true
    let position = getPosition(evt)
    onDragStart({ position, direction, target: node })
    lastPosition = position
    return false
  }
  function onPointerMove(evt) {
    if (evt.cancelable) evt.preventDefault()
    if (!isDragging) return false
    let currentPosition = getPosition(evt)
    let deltaLast = currentPosition - lastPosition
    if (deltaLast === 0) return false
    onDrag({
      delta: currentPosition - lastPosition,
      position: currentPosition,
      direction,
      target: node,
    })
    lastPosition = currentPosition
    return false
  }
  function onPointerUp(evt) {
    if (evt.cancelable) evt.preventDefault()
    if (!isDragging) return false
    node.releasePointerCapture(evt.pointerId)
    isDragging = false
    onDragEnd({
      position: getPosition(evt),
      direction,
      target: node,
    })
    lastPosition = null
    return false
  }

  function getPosition(evt) {
    if (direction === Directions.horizontal) {
      return evt.clientX
    }
    return evt.clientY
  }

  node.addEventListener("pointerdown", onPointerDown, { passive: false })
  node.addEventListener("pointermove", onPointerMove, { passive: false })
  node.addEventListener("pointerup", onPointerUp, { passive: false })
  node.addEventListener("pointercancel", onPointerUp, { passive: false })

  return function stop() {
    node.removeEventListener("pointerdown", onPointerDown, { passive: false })
    node.removeEventListener("pointermove", onPointerMove, { passive: false })
    node.removeEventListener("pointerup", onPointerUp, { passive: false })
    node.removeEventListener("pointercancel", onPointerUp, { passive: false })
  }
}
