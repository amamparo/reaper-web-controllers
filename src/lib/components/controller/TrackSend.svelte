<script>
  import Fader from '$lib/components/shared/Fader.svelte'
  import ToggleButton from '$lib/components/shared/ToggleButton.svelte'
  import { wwr_req } from '$lib/reaper/api.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'
  import { reaperColorToCSS } from '$lib/reaper/helpers.js'

  let { trackIndex, sendIndex, send } = $props()

  let targetTrack = $derived(
    send && send.otherTrackIndex >= 0
      ? tracksStore.getTrack(send.otherTrackIndex)
      : null
  )

  let targetName = $derived(
    send?.isHardwareOutput ? 'HW Out' : (targetTrack?.name || `Send ${sendIndex}`)
  )

  let color = $derived(targetTrack ? reaperColorToCSS(targetTrack.color) : null)

  function handleVol(vol) {
    wwr_req(`SET/TRACK/${trackIndex}/SEND/${sendIndex}/VOL/${vol}`)
  }

  function handleVolComplete(vol) {
    wwr_req(`SET/TRACK/${trackIndex}/SEND/${sendIndex}/VOL/${vol}e`)
  }

  function toggleMute() {
    wwr_req(`SET/TRACK/${trackIndex}/SEND/${sendIndex}/MUTE/-1`)
  }
</script>

{#if send}
  <div class="flex items-center gap-1.5 py-0.5 pl-6">
    <div
      class="w-2 h-2 rounded-full shrink-0"
      style="background-color: {color || '#555'}"
    ></div>
    <span class="text-[10px] text-neutral-500 w-14 truncate shrink-0">{targetName}</span>
    <div class="flex-1">
      <Fader value={send.volume} onchange={handleVol} oncomplete={handleVolComplete} label="" showDb={false} />
    </div>
    <ToggleButton
      active={send.isMuted}
      onclick={toggleMute}
      label="M"
      activeColor="bg-red-600"
      inactiveColor="bg-neutral-800"
      small={true}
    />
  </div>
{/if}
