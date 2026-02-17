<script>
  import TrackStrip from './TrackStrip.svelte'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'

  let tracks = $derived(tracksStore.tracks.filter(t => t !== null))
</script>

<div class="flex flex-col gap-2 overflow-y-auto" style="-webkit-overflow-scrolling: touch">
  {#each tracks as track (track.index)}
    <TrackStrip {track} />
  {/each}

  {#if tracks.length === 0}
    <p class="text-neutral-500 text-sm text-center py-8">Waiting for track data...</p>
  {/if}
</div>
