<script>
  import { transportStore } from '$lib/stores/transport.svelte.js'
  import { markersStore } from '$lib/stores/markers.svelte.js'
  import { wwr_req } from '$lib/reaper/api.svelte.js'
  import { CMD } from '$lib/reaper/commands.js'
  import { reaperColorToCSS, contrastColor } from '$lib/reaper/helpers.js'

  let nav = $derived(markersStore.getNavContext(transportStore.positionSeconds))
  let pos = $derived(transportStore.positionSeconds)

  function gotoPrev() {
    if (nav.prev) {
      wwr_req(String(CMD.MARKER_PREV))
    } else {
      wwr_req('SET/POS/0')
    }
  }

  function gotoNext() {
    if (nav.next) {
      wwr_req(String(CMD.MARKER_NEXT))
    }
  }

  function dropMarker() {
    wwr_req(String(CMD.MARKER_DROP))
  }

  function markerColor(m) {
    return reaperColorToCSS(m.color) || '#555'
  }

  function markerTextColor(m) {
    const bg = reaperColorToCSS(m.color)
    return bg ? contrastColor(bg) : '#ccc'
  }
</script>

<div class="flex items-center gap-1.5">
  <!-- Prev / Home -->
  <button
    type="button"
    onclick={gotoPrev}
    class="flex items-center gap-1 min-h-11 px-2 py-1 rounded bg-neutral-800 active:brightness-75 flex-1 min-w-0"
  >
    <span class="text-neutral-500 text-xs shrink-0">&laquo;</span>
    {#if nav.prev}
      <span
        class="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold shrink-0"
        style="background-color: {markerColor(nav.prev)}; color: {markerTextColor(nav.prev)}"
      >{nav.prev.id}</span>
      <span class="text-xs text-neutral-400 truncate">{nav.prev.name || 'unnamed'}</span>
    {:else}
      <span class="text-xs text-neutral-500">HOME</span>
    {/if}
  </button>

  <!-- Current / Drop marker -->
  {#if nav.current}
    <div class="flex items-center gap-1 px-2 py-1 rounded bg-neutral-700 min-h-11">
      <span
        class="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold shrink-0"
        style="background-color: {markerColor(nav.current)}; color: {markerTextColor(nav.current)}"
      >{nav.current.id}</span>
      <span class="text-xs text-neutral-200 truncate">{nav.current.name || 'unnamed'}</span>
    </div>
  {:else if pos > 0}
    <button
      type="button"
      onclick={dropMarker}
      class="min-h-11 px-3 py-1 rounded bg-neutral-800 text-neutral-500 text-xs
             active:brightness-75 hover:text-neutral-300"
      title="Drop marker"
    >+M</button>
  {/if}

  <!-- Next / End -->
  <button
    type="button"
    onclick={gotoNext}
    class="flex items-center gap-1 min-h-11 px-2 py-1 rounded bg-neutral-800 active:brightness-75 flex-1 min-w-0"
  >
    {#if nav.next}
      <span class="text-xs text-neutral-400 truncate">{nav.next.name || 'unnamed'}</span>
      <span
        class="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold shrink-0"
        style="background-color: {markerColor(nav.next)}; color: {markerTextColor(nav.next)}"
      >{nav.next.id}</span>
    {:else}
      <span class="text-xs text-neutral-500">END</span>
    {/if}
    <span class="text-neutral-500 text-xs shrink-0">&raquo;</span>
  </button>
</div>
