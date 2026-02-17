<script>
  import ReceiveChannel from './ReceiveChannel.svelte'
  import { monitorStore } from '$lib/stores/monitor.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'
  import { wwr_req } from '$lib/reaper/api.svelte.js'

  let track = $derived(monitorStore.selectedTrack)
  let trackIndex = $derived(monitorStore.selectedTrackIndex)

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

  // Solo state
  let soloedSet = $state(new Set())
  let preSoloMutes = new Map()

  // Clear solos when monitor track changes
  let prevTrackIndex = $state(null)
  $effect(() => {
    if (trackIndex !== prevTrackIndex) {
      soloedSet = new Set()
      preSoloMutes = new Map()
      prevTrackIndex = trackIndex
    }
  })

  function toggleSolo(receiveIndex) {
    const anySoloBefore = soloedSet.size > 0
    const newSet = new Set(soloedSet)

    if (newSet.has(receiveIndex)) {
      newSet.delete(receiveIndex)
    } else {
      newSet.add(receiveIndex)
    }

    const anySoloAfter = newSet.size > 0

    // Snapshot mute states before first solo
    if (!anySoloBefore && anySoloAfter) {
      preSoloMutes = new Map()
      for (const { receiveIndex: ri, send } of receives) {
        preSoloMutes.set(ri, send.isMuted)
      }
    }

    if (anySoloAfter) {
      // Mute non-soloed, unmute soloed
      for (const { receiveIndex: ri } of receives) {
        const shouldMute = !newSet.has(ri)
        wwr_req(`SET/TRACK/${trackIndex}/SEND/${ri}/MUTE/${shouldMute ? 1 : 0}`)
      }
    } else {
      // All solos cleared — restore pre-solo mute states
      for (const { receiveIndex: ri } of receives) {
        const wasMuted = preSoloMutes.get(ri) || false
        wwr_req(`SET/TRACK/${trackIndex}/SEND/${ri}/MUTE/${wasMuted ? 1 : 0}`)
      }
      preSoloMutes = new Map()
    }

    soloedSet = newSet
  }

  let anySolo = $derived(soloedSet.size > 0)
</script>

{#if receives.length > 0}
  <div class="flex flex-col gap-2">
    {#each receives as { receiveIndex, send } (receiveIndex)}
      <ReceiveChannel
        {trackIndex}
        {receiveIndex}
        {send}
        soloed={soloedSet.has(receiveIndex)}
        {anySolo}
        onToggleSolo={() => toggleSolo(receiveIndex)}
      />
    {/each}
  </div>
{:else if track}
  <p class="text-neutral-500 text-center py-4">Waiting for receive data...</p>
{/if}
