<script>
  import ReceiveChannel from './ReceiveChannel.svelte'
  import { monitorStore } from '$lib/stores/monitor.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'

  let track = $derived(monitorStore.selectedTrack)
  let trackIndex = $derived(monitorStore.selectedTrackIndex)

  // Build array of receive indices and their send data
  let receives = $derived.by(() => {
    if (!track) return []
    const result = []
    for (let i = 1; i <= track.recvCount; i++) {
      const send = tracksStore.getSend(trackIndex, -i)
      if (send) {
        result.push({ receiveIndex: -i, send })
      }
    }
    return result
  })
</script>

{#if receives.length > 0}
  <div class="flex flex-col gap-2">
    {#each receives as { receiveIndex, send } (receiveIndex)}
      <ReceiveChannel
        {trackIndex}
        {receiveIndex}
        {send}
      />
    {/each}
  </div>
{:else if track}
  <p class="text-neutral-500 text-center py-4">Waiting for receive data...</p>
{/if}
