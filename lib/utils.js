export function noOp() {}

export const Directions = Object.freeze({
  horizontal: "horizontal",
  vertical: "vertical",
})

export function camelToSnakeCase(s) {
  return s.replace(/([A-Z])/g, (_, letter) => "-" + letter.toLowerCase())
}
