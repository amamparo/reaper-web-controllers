<script>
  import { transportStore } from '$lib/stores/transport.svelte.js'

  const RADIUS = 40
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const CX = 48
  const CY = 48

  let currentBeat = $derived(Math.round(transportStore.beatsInMeasure))
  let tsNum = $derived(transportStore.tsNumerator)

  let dashOffset = $derived(CIRCUMFERENCE - (CIRCUMFERENCE / Math.max(1, tsNum)))
  let rotation = $derived((360 / Math.max(1, tsNum)) * currentBeat)
</script>

<svg width="96" height="96" viewBox="0 0 96 96" class="shrink-0">
  <!-- Background circle -->
  <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#333" stroke-width="4" />
  <!-- Beat arc -->
  <circle
    cx={CX} cy={CY} r={RADIUS}
    fill="none"
    stroke="#6b7280"
    stroke-width="4"
    stroke-dasharray={CIRCUMFERENCE}
    stroke-dashoffset={dashOffset}
    stroke-linecap="round"
    transform="rotate({rotation} {CX} {CY})"
    class="transition-transform duration-75"
  />
  <!-- Center beat number -->
  <text x={CX} y={CY + 1} text-anchor="middle" dominant-baseline="central"
    class="fill-neutral-300 text-lg font-bold" font-size="18">
    {currentBeat + 1}
  </text>
</svg>
