<script>
  import { onMount } from 'svelte'
  import { transportStore } from '$lib/stores/transport.svelte.js'
  import { wwr_req } from '$lib/reaper/api.svelte.js'

  let containerEl = $state(null)
  let dragging = $state(false)
  let rotation = $state(0)
  let jogAgg = $state(0)
  let startX = $state(0)
  let currentOffset = $state(0)
  let intervalId = null

  function getOffset(e) {
    const rect = containerEl.getBoundingClientRect()
    const width = rect.width
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    return (clientX - rect.left - width / 2) / (width / 2)
  }

  function handleStart(e) {
    e.preventDefault()
    dragging = true
    currentOffset = 0
    jogAgg = 0
    startX = e.touches ? e.touches[0].clientX : e.clientX

    intervalId = setInterval(() => {
      if (currentOffset !== 0) {
        jogAgg += currentOffset * 0.3
      }
    }, 100)
  }

  function handleMove(e) {
    if (!dragging) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const rect = containerEl.getBoundingClientRect()
    currentOffset = (clientX - startX) / (rect.width / 2)
    currentOffset = Math.max(-1, Math.min(1, currentOffset))
    rotation = currentOffset * 90
  }

  function handleEnd() {
    if (!dragging) return
    dragging = false
    if (intervalId) { clearInterval(intervalId); intervalId = null }

    if (Math.abs(jogAgg) > 0.01) {
      const seekAmount = Math.exp(Math.abs(jogAgg)) * Math.sign(jogAgg)
      const newPos = transportStore.positionSeconds + seekAmount
      wwr_req(`SET/POS/${Math.max(0, newPos)}`)
    }

    rotation = 0
    jogAgg = 0
    currentOffset = 0
  }

  onMount(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  })

  let jogDisplay = $derived.by(() => {
    if (!dragging || Math.abs(jogAgg) < 0.01) return null
    const sign = jogAgg < 0 ? '-' : '+'
    const val = Math.exp(Math.abs(jogAgg))
    return `${sign}${val.toFixed(1)}s`
  })
</script>

<div
  bind:this={containerEl}
  role="slider"
  tabindex="0"
  aria-label="Jog wheel"
  aria-valuemin="-1"
  aria-valuemax="1"
  aria-valuenow={currentOffset}
  onmousedown={handleStart}
  ontouchstart={handleStart}
  onmousemove={handleMove}
  ontouchmove={handleMove}
  onmouseup={handleEnd}
  ontouchend={handleEnd}
  onmouseleave={handleEnd}
  class="relative w-28 h-28 mx-auto cursor-grab active:cursor-grabbing select-none touch-none"
>
  <svg viewBox="0 0 120 120" class="w-full h-full" style="transform: rotate({rotation}deg)">
    <!-- Outer ring -->
    <circle cx="60" cy="60" r="55" fill="none" stroke="#444" stroke-width="6" />
    <!-- Inner disc -->
    <circle cx="60" cy="60" r="45" fill="#2a2a2a" />
    <!-- Notch lines for rotation feedback -->
    <line x1="60" y1="18" x2="60" y2="28" stroke="#666" stroke-width="2" />
    <line x1="60" y1="92" x2="60" y2="102" stroke="#444" stroke-width="2" />
    <line x1="18" y1="60" x2="28" y2="60" stroke="#444" stroke-width="2" />
    <line x1="92" y1="60" x2="102" y2="60" stroke="#444" stroke-width="2" />
    <!-- Center dot -->
    <circle cx="60" cy="60" r="3" fill="#555" />
  </svg>

  {#if jogDisplay}
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span class="text-sm font-mono font-bold
        {jogAgg < 0 ? 'text-red-400' : 'text-green-400'}
      ">{jogDisplay}</span>
    </div>
  {/if}
</div>
