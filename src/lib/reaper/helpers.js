/** Convert linear volume (0..4) to dB string */
export function mkvolstr(vol) {
  const v = parseFloat(vol)
  if (v < 0.00000002980232) return '-inf dB'
  return (Math.log(v) * 8.68588963806).toFixed(2) + ' dB'
}

/** Convert pan (-1..1) to display string */
export function mkpanstr(pan) {
  if (Math.abs(pan) < 0.001) return 'center'
  if (pan > 0) return (pan * 100).toFixed(0) + '%R'
  return (pan * -100).toFixed(0) + '%L'
}

/** Unescape Reaper's tab/newline/backslash encoding */
export function simpleUnescape(v) {
  return String(v).replace(/\\t/g, '\t').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
}

/** Volume linear (0..4) to fader position (0..1) using quartic law */
export function volToFaderPos(vol) {
  const v = parseFloat(vol)
  if (v <= 0) return 0
  return Math.pow(v, 0.25) / Math.pow(4, 0.25)
}

/** Fader position (0..1) to volume linear (0..4) using quartic law */
export function faderPosToVol(pos) {
  return Math.pow(pos, 4) * 4
}

/** Parse Reaper color (0xaarrggbb int) to CSS hex, or null if no custom color */
export function reaperColorToCSS(colorInt) {
  const c = parseInt(colorInt)
  if (!c || c === 0) return null
  return '#' + (c | 0x1000000).toString(16).substr(-6)
}

/** Luminance-based contrast color for text on colored backgrounds */
export function contrastColor(hexColor) {
  const c = hexColor.substring(1)
  const rgb = parseInt(c, 16)
  let r = (rgb >> 16) & 0xff
  let g = (rgb >> 8) & 0xff
  let b = (rgb >> 0) & 0xff
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  if (luma < 150) { r += 150; g += 150; b += 150 }
  else { r -= 120; g -= 120; b -= 120 }
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))
  const hex = (c) => c.toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

/** Track flags bitmask constants */
export const TrackFlags = {
  FOLDER: 1,
  SELECTED: 2,
  HAS_FX: 4,
  MUTED: 8,
  SOLOED: 16,
  SOLO_IN_PLACE: 32,
  REC_ARMED: 64,
  REC_MON_ON: 128,
  REC_MON_AUTO: 256,
}

/** Send flags bitmask constants */
export const SendFlags = {
  MUTED: 8,
}
