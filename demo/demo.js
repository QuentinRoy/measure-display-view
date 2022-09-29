import ScreenSize from "../lib/index.js"

let view = document.querySelector("#view")
let ratioInput = document.querySelector("#ratio")
let result = document.querySelector("#result")

function update(ratio) {
  let dimensions = sc.getDisplayDimensions()
  result.innerHTML = `${Math.round(
    dimensions.width
  )}&thinsp;mm&nbsp;&times;&nbsp;${Math.round(
    dimensions.height
  )}&thinsp;mm, diagonal ${mmToInches(
    diagonal(dimensions.width, dimensions.height)
  ).toFixed(2)}&thinsp;in`
  ratioInput.value = ratio
}

function mmToInches(x) {
  return x / 25.4
}

function diagonal(x, y) {
  return Math.sqrt(x * x + y * y)
}

let sc = ScreenSize({ node: view, onChange: update })

ratioInput.addEventListener("input", () => {
  sc.setRatio(ratioInput.value)
})

update(sc.getRatio())
