<script>
  import Fader from '$lib/components/shared/Fader.svelte'
  import { wwr_req } from '$lib/reaper/api.svelte.js'
  import { monitorStore } from '$lib/stores/monitor.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'

  let trackIndex = $derived(monitorStore.selectedTrackIndex)
  let hwSend = $derived(tracksStore.getSend(trackIndex, 0))

  function handleVolumeChange(vol) {
    wwr_req(`SET/TRACK/${trackIndex}/SEND/0/VOL/${vol}`)
  }

  function handleVolumeComplete(vol) {
    wwr_req(`SET/TRACK/${trackIndex}/SEND/0/VOL/${vol}e`)
  }
</script>

{#if hwSend}
  <div class="p-3 rounded-lg bg-neutral-700/50 border border-neutral-600">
    <div class="text-xs text-neutral-400 uppercase tracking-wider mb-1">Master Output</div>
    <Fader
      value={hwSend.volume}
      onchange={handleVolumeChange}
      oncomplete={handleVolumeComplete}
      large={true}
    />
  </div>
{/if}
