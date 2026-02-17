<script>
  import { mkvolstr } from '$lib/reaper/helpers.js'
  import { volToFaderPos, faderPosToVol } from '$lib/reaper/helpers.js'

  let { value = 0, onchange, oncomplete, label = '', showDb = true, large = false } = $props()

  const UNITY_VOL = 1.0
  const UNITY_POS = volToFaderPos(UNITY_VOL)
  const TAP_THRESHOLD = 5

  let dragging = $state(false)
  let rangeEl = $state(null)
  let isDrag = false
  let pointerStartX = 0
  let valueAtDown = '0'
  let lastTapTime = 0

  let displayPos = $derived(dragging ? undefined : volToFaderPos(value))

  function handlePointerDown(e) {
    pointerStartX = e.clientX
    valueAtDown = rangeEl.value
    isDrag = false
  }

  function handlePointerMove(e) {
    if (isDrag) return
    if (Math.abs(e.clientX - pointerStartX) > TAP_THRESHOLD) {
      isDrag = true
      dragging = true
    }
  }

  function handleInput(e) {
    if (!isDrag) {
      rangeEl.value = valueAtDown
      return
    }
    dragging = true
    const pos = parseFloat(e.target.value)
    const vol = faderPosToVol(pos)
    onchange?.(vol)
  }

  function handlePointerUp() {
    if (!isDrag) {
      const now = Date.now()
      if (now - lastTapTime < 300) {
        rangeEl.value = UNITY_POS
        onchange?.(UNITY_VOL)
        oncomplete?.(UNITY_VOL)
        lastTapTime = 0
      } else {
        lastTapTime = now
      }
    } else {
      const pos = parseFloat(rangeEl.value)
      const vol = faderPosToVol(pos)
      oncomplete?.(vol)
    }
    isDrag = false
    dragging = false
  }

  $effect(() => {
    if (rangeEl && !dragging && displayPos !== undefined) {
      rangeEl.value = displayPos
    }
  })
</script>

<div class="flex items-center gap-2" class:py-2={large} class:py-1={!large}>
  {#if label}
    <span class="text-xs text-neutral-400 w-16 truncate shrink-0">{label}</span>
  {/if}
  <div class="fader-wrap relative flex-1">
    <input
      bind:this={rangeEl}
      type="range"
      min="0"
      max="1"
      step="0.002"
      value={volToFaderPos(value)}
      oninput={handleInput}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      class="fader-range w-full cursor-pointer touch-none"
      class:fader-large={large}
    />
    <div class="fader-unity-tick" class:fader-unity-tick-large={large}></div>
  </div>
  {#if showDb}
    <span class="text-xs text-neutral-500 w-18 text-right shrink-0 font-mono tabular-nums">
      {mkvolstr(value)}
    </span>
  {/if}
</div>

<style>
  .fader-range {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    background: transparent;
    height: 2.5rem;
  }
  .fader-range.fader-large {
    height: 3rem;
  }

  /* Track */
  .fader-range::-webkit-slider-runnable-track {
    height: 0.5rem;
    border-radius: 9999px;
    background: #262626;
  }
  .fader-range.fader-large::-webkit-slider-runnable-track {
    height: 0.75rem;
  }
  .fader-range::-moz-range-track {
    height: 0.5rem;
    border-radius: 9999px;
    background: #262626;
  }
  .fader-range.fader-large::-moz-range-track {
    height: 0.75rem;
  }

  /* Thumb */
  .fader-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background: #d4d4d4;
    margin-top: -1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
  .fader-range.fader-large::-webkit-slider-thumb {
    width: 3rem;
    height: 3rem;
    margin-top: -1.125rem;
  }
  .fader-range::-moz-range-thumb {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background: #d4d4d4;
    border: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
  .fader-range.fader-large::-moz-range-thumb {
    width: 3rem;
    height: 3rem;
  }

  /* Unity gain tick mark */
  .fader-wrap {
    position: relative;
  }
  .fader-unity-tick {
    position: absolute;
    left: calc(70.71% - 0.7071 * 2.5rem + 1.25rem);
    top: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 0.75rem;
    background: #525252;
    pointer-events: none;
    border-radius: 1px;
  }
  .fader-unity-tick-large {
    left: calc(70.71% - 0.7071 * 3rem + 1.5rem);
    height: 1rem;
  }
</style>
