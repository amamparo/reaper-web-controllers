<script>
  import Fader from '$lib/components/shared/Fader.svelte'
  import MeterBar from '$lib/components/shared/MeterBar.svelte'
  import ToggleButton from '$lib/components/shared/ToggleButton.svelte'
  import { wwr_req } from '$lib/reaper/api.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'
  import { reaperColorToCSS } from '$lib/reaper/helpers.js'

  let { trackIndex, receiveIndex, send, soloed = false, anySolo = false, onToggleSolo } = $props()

  let sourceTrack = $derived(send ? tracksStore.getTrack(send.otherTrackIndex) : null)
  let trackColor = $derived(sourceTrack ? reaperColorToCSS(sourceTrack.color) : null)

  function handleVolumeChange(vol) {
    wwr_req(`SET/TRACK/${trackIndex}/SEND/${receiveIndex}/VOL/${vol}`)
  }

  function handleVolumeComplete(vol) {
    wwr_req(`SET/TRACK/${trackIndex}/SEND/${receiveIndex}/VOL/${vol}e`)
  }

  function toggleMute() {
    wwr_req(`SET/TRACK/${trackIndex}/SEND/${receiveIndex}/MUTE/-1`)
  }
</script>

{#if send && sourceTrack}
  <div
    class="flex flex-col gap-1 p-3 rounded-lg bg-neutral-900/50 transition-opacity"
    class:opacity-40={anySolo && !soloed}
  >
    <!-- Header: color dot + name + solo + mute -->
    <div class="flex items-center gap-2 mb-1">
      <div
        class="w-3 h-3 rounded-full shrink-0"
        style="background-color: {trackColor || '#555'}"
      ></div>
      <span class="text-sm text-neutral-200 font-medium truncate flex-1">
        {sourceTrack.name}
      </span>
      <ToggleButton
        active={soloed}
        onclick={onToggleSolo}
        label="S"
        activeColor="bg-yellow-600"
        inactiveColor="bg-neutral-800"
        small={true}
      />
      <ToggleButton
        active={send.isMuted}
        onclick={toggleMute}
        label="M"
        activeColor="bg-red-600"
        inactiveColor="bg-neutral-800"
        small={true}
      />
    </div>

    <!-- Fader -->
    <Fader
      value={send.volume}
      onchange={handleVolumeChange}
      oncomplete={handleVolumeComplete}
    />

    <!-- Meter -->
    <MeterBar peakL={sourceTrack.peakL} peakR={sourceTrack.peakR} />
  </div>
{/if}
