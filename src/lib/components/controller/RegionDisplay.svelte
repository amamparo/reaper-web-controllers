<script>
  import { transportStore } from '$lib/stores/transport.svelte.js'
  import { markersStore } from '$lib/stores/markers.svelte.js'
  import { reaperColorToCSS, contrastColor } from '$lib/reaper/helpers.js'

  let activeRegions = $derived(markersStore.getActiveRegions(transportStore.positionSeconds))
</script>

{#if activeRegions.length > 0}
  <div class="flex flex-col gap-1">
    {#each activeRegions.slice(0, 4) as region (region.id)}
      {@const color = reaperColorToCSS(region.color) || '#555'}
      {@const textColor = contrastColor(color)}
      <div
        class="rounded px-2 py-1 text-xs font-medium truncate"
        style="background-color: {color}; color: {textColor}"
      >
        {region.name || `Region ${region.id}`}
      </div>
    {/each}
  </div>
{/if}
