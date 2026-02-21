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
    <div class="fader-track" class:fader-track-large={large}></div>
    <div class="fader-unity-tick" class:fader-unity-tick-large={large}></div>
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
      class="fader-range w-full cursor-pointer touch-pan-y"
      class:fader-large={large}
    />
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

  /* Native track — invisible (visual track is a separate div) */
  .fader-range::-webkit-slider-runnable-track {
    height: 0.375rem;
    background: transparent;
  }
  .fader-range.fader-large::-webkit-slider-runnable-track {
    height: 0.5rem;
  }
  .fader-range::-moz-range-track {
    height: 0.375rem;
    background: transparent;
  }
  .fader-range.fader-large::-moz-range-track {
    height: 0.5rem;
  }

  /* Visual track — separate div so tick can layer above it */
  .fader-track {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 0.375rem;
    border-radius: 2px;
    background: #0a0a0a;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
    z-index: 0;
    pointer-events: none;
  }
  .fader-track-large {
    height: 0.5rem;
  }

  /* Thumb — fader knob */
  .fader-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 2rem;
    height: 2rem;
    border-radius: 3px;
    margin-top: -0.8125rem;
    background-image:
      linear-gradient(to right,
        transparent 28%,
        rgba(0,0,0,0.4) 28%, rgba(0,0,0,0.4) 30%,
        rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.25) 32%,
        transparent 32%,
        transparent 48%,
        rgba(0,0,0,0.4) 48%, rgba(0,0,0,0.4) 50%,
        rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 52%,
        transparent 52%,
        transparent 68%,
        rgba(0,0,0,0.4) 68%, rgba(0,0,0,0.4) 70%,
        rgba(255,255,255,0.25) 70%, rgba(255,255,255,0.25) 72%,
        transparent 72%),
      linear-gradient(to bottom,
        #e0e0e0 0%, #ccc 20%, #b0b0b0 50%, #bbb 80%, #d0d0d0 100%);
    background-size: 100% 50%, 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    box-shadow:
      0 1px 4px rgba(0,0,0,0.5),
      0 0 0 0.5px rgba(0,0,0,0.2),
      inset 0 1px 0 rgba(255,255,255,0.4),
      inset 0 -1px 0 rgba(0,0,0,0.1);
  }
  .fader-range.fader-large::-webkit-slider-thumb {
    width: 2.25rem;
    height: 2.5rem;
    margin-top: -1rem;
  }
  .fader-range::-moz-range-thumb {
    width: 2rem;
    height: 2rem;
    border-radius: 3px;
    border: none;
    background-image:
      linear-gradient(to right,
        transparent 28%,
        rgba(0,0,0,0.4) 28%, rgba(0,0,0,0.4) 30%,
        rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.25) 32%,
        transparent 32%,
        transparent 48%,
        rgba(0,0,0,0.4) 48%, rgba(0,0,0,0.4) 50%,
        rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 52%,
        transparent 52%,
        transparent 68%,
        rgba(0,0,0,0.4) 68%, rgba(0,0,0,0.4) 70%,
        rgba(255,255,255,0.25) 70%, rgba(255,255,255,0.25) 72%,
        transparent 72%),
      linear-gradient(to bottom,
        #e0e0e0 0%, #ccc 20%, #b0b0b0 50%, #bbb 80%, #d0d0d0 100%);
    background-size: 100% 50%, 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    box-shadow:
      0 1px 4px rgba(0,0,0,0.5),
      0 0 0 0.5px rgba(0,0,0,0.2),
      inset 0 1px 0 rgba(255,255,255,0.4),
      inset 0 -1px 0 rgba(0,0,0,0.1);
  }
  .fader-range.fader-large::-moz-range-thumb {
    width: 2.25rem;
    height: 2.5rem;
  }

  /* Unity gain tick mark — behind the knob */
  .fader-wrap {
    position: relative;
  }
  .fader-range {
    position: relative;
    z-index: 2;
  }
  .fader-unity-tick {
    position: absolute;
    left: calc(70.71% - 0.7071 * 2rem + 1rem);
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 2px;
    height: 1.25rem;
    background: #404040;
    pointer-events: none;
    border-radius: 1px;
  }
  .fader-unity-tick-large {
    left: calc(70.71% - 0.7071 * 2.25rem + 1.125rem);
    height: 1.5rem;
  }
</style>
