import ScreenSize from "../lib/index.js"

let view = document.querySelector("#view")
let ratioInput = document.querySelector("#ratio")
let result = document.querySelector("#result")

function update(ratio) {
  let dimensions = sc.getDisplayDimensions()
  result.innerHTML = `${Math.round(
    dimensions.width
  )}mm&nbsp;&times;&nbsp;${Math.round(dimensions.height)}mm`
  ratioInput.value = ratio
}

let sc = ScreenSize({ node: view, onChange: update })

ratioInput.addEventListener("input", () => {
  sc.setRatio(ratioInput.value)
})

update(sc.getRatio())
