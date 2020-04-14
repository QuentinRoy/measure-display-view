import { Directions, noOp, camelToSnakeCase } from "./utils.js"
import DragControler from "./drag-controller.js"

function template({ rulersOrientation }) {
  const orientationClassName = `${rulersOrientation}-rulers`
  return `
    <div class="measure-display-view ${orientationClassName}">
      <div class="credit">
        <div class="chip"></div>
      </div>
      <div class="rulers">
        <div class="left-ruler"></div>
        <div class="right-ruler interactive-ruler">
          <div class="drag-area"></div>
        </div>
        <div class="top-ruler"></div>
        <div class="bottom-ruler interactive-ruler">
          <div class="drag-area"></div>
        </div>
      </div>
    </div>
  `
}

const cssParameters = Object.freeze([
  "creditBackground",
  "chipBackground",
  "rulersWidth",
  "rulersLength",
  "staticRulersColor",
  "interactiveRulersColor",
  "hoveredInteractiveRulersColor",
  "activeInteractiveRulersColor",
  "hoveredInteractiveRulersShadow",
  "activeInteractiveRulersShadow",
  "dragAreaWidth",
  "creditWidth",
  "creditHeight",
  "creditRoundedCorners",
  "chipTop",
  "chipLeft",
  "chipWidth",
  "chipHeight",
  "chipRoundedCorners",
])

export default function MeasureDisplayView({
  node,
  rulersOrientation = Directions.horizontal,
  ratio = 1,
  onChange = noOp,
  ...cssArgs
}) {
  node.innerHTML = template({ rulersOrientation })
  const main = node.querySelector(".measure-display-view")
  const creditElt = main.querySelector(".credit")

  cssParameters.forEach((argName) => {
    let value = cssArgs[argName]
    if (value != null) {
      main.style.setProperty(`--${camelToSnakeCase(argName)}`, value)
    }
  })

  function updateView() {
    main.style.setProperty("--mm-px-ratio", ratio)
  }

  function getRatio() {
    return ratio
  }

  function setRatio(value) {
    ratio = value
    updateView()
    result.onChange(ratio)
  }

  function getDisplayDimensions() {
    // We could re-use ratio, but just in case it was edited from the outside,
    // we recompute it from what's displayed.
    const creditMMWidth = +getComputedStyle(creditElt).getPropertyValue(
      "--credit-width"
    )
    let { width: screenPxWidth, height: screenPxHeight } = window.screen
    let { width: creditPxWidth } = creditElt.getBoundingClientRect()
    let mmPxRatio = creditPxWidth / creditMMWidth
    return {
      width: screenPxWidth / mmPxRatio,
      height: screenPxHeight / mmPxRatio,
    }
  }

  // dragDelta prevents the credit size to "jump" on the edge of the credit
  // when the user starts to drag with some offset from it.
  let dragDelta
  function onDragStart({ direction, position, target }) {
    main.classList.add("active")
    target.classList.add("active")
    let creditRect = creditElt.getBoundingClientRect()
    if (direction === Directions.horizontal) {
      dragDelta = creditRect.right - position
    } else {
      dragDelta = creditRect.bottom - position
    }
  }
  function onDrag({ position, direction }) {
    let creaditRect = creditElt.getBoundingClientRect()
    let reqDim, dim
    if (direction === Directions.horizontal) {
      reqDim = position + dragDelta - creaditRect.left
      dim = creaditRect.width
    } else {
      reqDim = position + dragDelta - creaditRect.top
      dim = creaditRect.height
    }
    let newRatio = Math.max(0.01, (reqDim * getRatio()) / dim)
    setRatio(newRatio)
  }
  function onDragEnd({ target }) {
    node.style.cursor = ""
    main.classList.remove("active")
    target.classList.remove("active")
  }

  let stopHDrag = DragControler({
    node: main.querySelector(".right-ruler"),
    direction: Directions.horizontal,
    onDrag,
    onDragStart,
    onDragEnd,
  })

  let stopVDrag = DragControler({
    node: main.querySelector(".bottom-ruler"),
    direction: Directions.vertical,
    onDrag,
    onDragStart,
    onDragEnd,
  })

  function remove() {
    stopHDrag()
    stopVDrag()
    main.remove()
  }

  const result = {
    onChange,
    getRatio,
    setRatio,
    getDisplayDimensions,
    remove,
  }

  updateView()

  return result
}
