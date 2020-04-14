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

  function onPointerStart(position, evt) {
    if (isDragging) throw new Error(`Already dragging`)
    evt.preventDefault()
    isDragging = true
    lastPosition = position
    onDragStart({ position, direction, target: node, originalEvent: evt })
  }
  function onPointerMove(currentPosition, evt) {
    if (!isDragging) return
    evt.preventDefault()
    let deltaLast = currentPosition - lastPosition
    if (deltaLast === 0) return
    onDrag({
      delta: currentPosition - lastPosition,
      position: currentPosition,
      direction,
      target: node,
      originalEvent: evt,
    })
    lastPosition = currentPosition
  }
  function onPointerEnd(position, evt) {
    if (!isDragging) return
    evt.preventDefault()
    isDragging = false
    onDragEnd({ position, direction, target: node, originalEvent: evt })
  }

  function onMouseDown(evt) {
    onPointerStart(getMouseEventPosition(evt), evt)
  }
  function onTouchStart(evt) {
    if (evt.targetTouches.length !== 1 && isDragging) onTouchEnd(evt)
    onPointerStart(getTouchEventPosition(evt), evt)
  }
  function onMouseMove(evt) {
    onPointerMove(getMouseEventPosition(evt), evt)
  }
  function onTouchMove(evt) {
    onPointerMove(getTouchEventPosition(evt), evt)
  }
  function onMouseUp(evt) {
    onPointerEnd(getMouseEventPosition(evt), evt)
  }
  function onTouchEnd(evt) {
    onPointerEnd(null, evt)
  }
  function getMouseEventPosition(evt) {
    if (direction === Directions.horizontal) {
      return evt.clientX
    }
    return evt.clientY
  }
  function getTouchEventPosition(evt) {
    if (evt.targetTouches.length !== 1) {
      throw new Error(`One and only one touch is supported on the target`)
    }
    if (direction === Directions.horizontal) {
      return evt.targetTouches[0].clientX
    }
    return evt.targetTouches[0].clientY
  }

  node.addEventListener("mousedown", onMouseDown)
  document.body.addEventListener("mousemove", onMouseMove)
  document.body.addEventListener("mouseup", onMouseUp)
  document.body.addEventListener("mouseleave", onMouseUp)
  node.addEventListener("touchstart", onTouchStart)
  node.addEventListener("touchmove", onTouchMove)
  node.addEventListener("touchend", onTouchEnd)
  node.addEventListener("touchcancel", onTouchEnd)

  return function stop() {
    node.removeEventListener("mousedown", onMouseDown)
    document.body.removeEventListener("mousemove", onMouseMove)
    document.body.removeEventListener("mouseup", onMouseUp)
    document.body.addEventListener("mouseleave", onMouseUp)
    node.removeEventListener("touchstart", onTouchStart)
    node.removeEventListener("touchmove", onTouchMove)
    node.removeEventListener("touchend", onTouchEnd)
    node.removeEventListener("touchcancel", onTouchEnd)
  }
}
