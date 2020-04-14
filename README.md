# Measure Display View

This is a small utility to let the user measure their display from a credit card.

## Install with NPM or Yarn

```sh
npm add @quentinroy/measure-display-view
```

The library exports an ES module as its default package export, as well as `style.css`.
Both must be imported in your project for the view to work.

Using a package manager like npm or yarn, it is easier to use the library with a bundler that enables importing css files from you JS modules. For example:

```js
import MeasureDisplayView from "@quentinroy/measure-display-view"
import "@quentinroy/measure-display-view/style.css"
```

## Install from sources

Download the repository. All relevant files are in the `lib` folder. Import `index.js` as an ES module. Include `measure-display-view.css` as a stylesheet in your HTML.

## API

```js
import MeasureDisplayView, { Directions } from "path/to/lib/index.js"

let mdv = MeasureDisplayView({
  // Required: where to mount the view.
  node: document.querySelector("#target-node"),
  // Optional: Whether vertical or horizontal rulers should be used.
  rulerOrientation: Directions.horizontal,
  // Optional: function to call when the ratio has changed.
  onChange(newPxMmRatio) {},
  // Optional: the initial ratio.
  ratio: 1,
})

mdv.setRatio(2.1)
console.log("ratio:", mdv.getRatio())

let { width: displayWidth, heigh: displayHeight } = mdv.getDisplayDimensions()
console.log("dimensions:", `${displayWidth} × ${displayHeight}`)

mdv.remove()
```
