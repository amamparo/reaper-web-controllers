<script>
  let { peakL = -1000, peakR = -1000, vertical = false } = $props()

  // peakL/peakR are dB*10 integers (e.g. -100 = -10dB)
  // Map to 0-100%: -60dB = 0%, 0dB = 100%, >0dB = clip
  function dbToPercent(dbTen) {
    const db = dbTen / 10
    if (db <= -60) return 0
    if (db >= 0) return 100
    return ((db + 60) / 60) * 100
  }

  let pctL = $derived(dbToPercent(peakL))
  let pctR = $derived(dbToPercent(peakR))
  let clipL = $derived(peakL > 0)
  let clipR = $derived(peakR > 0)
</script>

{#if vertical}
  <div class="flex gap-0.5 h-full w-3">
    <div class="relative flex-1 bg-neutral-950 rounded-sm overflow-hidden">
      <div
        class="absolute bottom-0 left-0 right-0 rounded-sm transition-[height] duration-100"
        style="height: {pctL}%; background: linear-gradient(to top, #22c55e, #eab308 70%, #ef4444 95%)"
      ></div>
      {#if clipL}
        <div class="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
      {/if}
    </div>
    <div class="relative flex-1 bg-neutral-950 rounded-sm overflow-hidden">
      <div
        class="absolute bottom-0 left-0 right-0 rounded-sm transition-[height] duration-100"
        style="height: {pctR}%; background: linear-gradient(to top, #22c55e, #eab308 70%, #ef4444 95%)"
      ></div>
      {#if clipR}
        <div class="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex flex-col gap-0.5 w-full h-3">
    <div class="relative flex-1 bg-neutral-950 rounded-sm overflow-hidden">
      <div
        class="absolute top-0 left-0 bottom-0 rounded-sm transition-[width] duration-100"
        style="width: {pctL}%; background: linear-gradient(to right, #22c55e, #eab308 70%, #ef4444 95%)"
      ></div>
      {#if clipL}
        <div class="absolute top-0 right-0 bottom-0 w-1 bg-red-500"></div>
      {/if}
    </div>
    <div class="relative flex-1 bg-neutral-950 rounded-sm overflow-hidden">
      <div
        class="absolute top-0 left-0 bottom-0 rounded-sm transition-[width] duration-100"
        style="width: {pctR}%; background: linear-gradient(to right, #22c55e, #eab308 70%, #ef4444 95%)"
      ></div>
      {#if clipR}
        <div class="absolute top-0 right-0 bottom-0 w-1 bg-red-500"></div>
      {/if}
    </div>
  </div>
{/if}
