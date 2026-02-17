<script>
  import { mkpanstr } from '$lib/reaper/helpers.js'

  let { value = 0, onchange, oncomplete } = $props()

  let dragging = $state(false)
  let rangeEl = $state(null)

  function handleInput(e) {
    dragging = true
    let v = parseFloat(e.target.value)
    // Center detent: snap to 0 when close
    if (Math.abs(v) < 0.03) v = 0
    onchange?.(v)
  }

  function handleEnd(e) {
    if (!dragging) return
    let v = parseFloat(e.target.value)
    if (Math.abs(v) < 0.03) v = 0
    oncomplete?.(v)
    dragging = false
  }

  $effect(() => {
    if (rangeEl && !dragging) {
      rangeEl.value = value
    }
  })
</script>

<div class="flex items-center gap-1">
  <input
    bind:this={rangeEl}
    type="range"
    min="-1"
    max="1"
    step="0.01"
    value={value}
    oninput={handleInput}
    onmouseup={handleEnd}
    ontouchend={handleEnd}
    class="w-20 h-8 appearance-none bg-transparent cursor-pointer touch-none
           [&::-webkit-slider-runnable-track]:rounded-full
           [&::-webkit-slider-runnable-track]:bg-neutral-800
           [&::-webkit-slider-runnable-track]:h-1.5
           [&::-webkit-slider-thumb]:appearance-none
           [&::-webkit-slider-thumb]:rounded-full
           [&::-webkit-slider-thumb]:bg-neutral-400
           [&::-webkit-slider-thumb]:w-6
           [&::-webkit-slider-thumb]:h-6
           [&::-webkit-slider-thumb]:mt-[-10px]
           [&::-moz-range-track]:rounded-full
           [&::-moz-range-track]:bg-neutral-800
           [&::-moz-range-track]:h-1.5
           [&::-moz-range-thumb]:rounded-full
           [&::-moz-range-thumb]:bg-neutral-400
           [&::-moz-range-thumb]:border-none
           [&::-moz-range-thumb]:w-6
           [&::-moz-range-thumb]:h-6"
  />
  <span class="text-[10px] text-neutral-500 w-12 text-center font-mono">{mkpanstr(value)}</span>
</div>
