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
    if (evt.cancelable) evt.preventDefault()
    if (isDragging) throw new Error(`Already dragging`)
    isDragging = true
    lastPosition = position
    onDragStart({ position, direction, target: node, originalEvent: evt })
    return false
  }
  function onPointerMove(currentPosition, evt) {
    if (evt.cancelable) evt.preventDefault()
    if (!isDragging) return false
    let deltaLast = currentPosition - lastPosition
    if (deltaLast === 0) return false
    onDrag({
      delta: currentPosition - lastPosition,
      position: currentPosition,
      direction,
      target: node,
      originalEvent: evt,
    })
    lastPosition = currentPosition
    return false
  }
  function onPointerEnd(position, evt) {
    if (evt.cancelable) evt.preventDefault()
    if (!isDragging) return false
    isDragging = false
    onDragEnd({ position, direction, target: node, originalEvent: evt })
    return false
  }

  function onMouseDown(evt) {
    return onPointerStart(getMouseEventPosition(evt), evt)
  }
  function onTouchStart(evt) {
    if (evt.targetTouches.length !== 1 && isDragging) return onTouchEnd(evt)
    else return onPointerStart(getTouchEventPosition(evt), evt)
  }
  function onMouseMove(evt) {
    return onPointerMove(getMouseEventPosition(evt), evt)
  }
  function onTouchMove(evt) {
    return onPointerMove(getTouchEventPosition(evt), evt)
  }
  function onMouseUp(evt) {
    return onPointerEnd(getMouseEventPosition(evt), evt)
  }
  function onTouchEnd(evt) {
    return onPointerEnd(null, evt)
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

  node.addEventListener("touchstart", onTouchStart, { passive: false })
  node.addEventListener("touchmove", onTouchMove, { passive: false })
  node.addEventListener("touchend", onTouchEnd, { passive: false })
  node.addEventListener("touchcancel", onTouchEnd, { passive: false })
  node.addEventListener("mousedown", onMouseDown, { passive: false })
  document.body.addEventListener("mousemove", onMouseMove, { passive: false })
  document.body.addEventListener("mouseup", onMouseUp, { passive: false })
  document.body.addEventListener("mouseleave", onMouseUp, { passive: false })

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
