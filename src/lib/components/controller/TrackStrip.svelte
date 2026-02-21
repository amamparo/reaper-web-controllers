<script>
  import Fader from '$lib/components/shared/Fader.svelte'
  import MeterBar from '$lib/components/shared/MeterBar.svelte'
  import ToggleButton from '$lib/components/shared/ToggleButton.svelte'
  import TrackSend from './TrackSend.svelte'
  import { wwr_req } from '$lib/reaper/api.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'
  import { reaperColorToCSS, TrackFlags } from '$lib/reaper/helpers.js'

  let { track } = $props()

  let expanded = $state(false)
  let color = $derived(reaperColorToCSS(track.color) || '#555')
  let isMuted = $derived(!!(track.flags & TrackFlags.MUTED))
  let isSoloed = $derived(!!(track.flags & TrackFlags.SOLOED))
  let isArmed = $derived(!!(track.flags & TrackFlags.REC_ARMED))
  let recMon = $derived(
    (track.flags & TrackFlags.REC_MON_ON) ? 'on'
    : (track.flags & TrackFlags.REC_MON_AUTO) ? 'auto'
    : 'off'
  )

  function setVol(vol) { wwr_req(`SET/TRACK/${track.index}/VOL/${vol}`) }
  function toggleMute() { wwr_req(`SET/TRACK/${track.index}/MUTE/-1`) }
  function toggleSolo() { wwr_req(`SET/TRACK/${track.index}/SOLO/-1`) }
  function toggleArm() { wwr_req(`SET/TRACK/${track.index}/RECARM/-1`) }
  function cycleMonitor() { wwr_req(`SET/TRACK/${track.index}/RECMON/-1`) }

  // Sends: request send data when expanded
  $effect(() => {
    if (expanded && track.sendCount > 0) {
      for (let i = 0; i < track.sendCount; i++) {
        wwr_req(`GET/TRACK/${track.index}/SEND/${i}`)
      }
    }
  })

  let sends = $derived.by(() => {
    if (!expanded) return []
    const result = []
    for (let i = 0; i < track.sendCount; i++) {
      const s = tracksStore.getSend(track.index, i)
      if (s) result.push({ sendIndex: i, send: s })
    }
    return result
  })
</script>

<div class="rounded-lg overflow-hidden bg-neutral-900/50">
  <!-- Track header with color bar -->
  <div class="flex items-center gap-1.5 px-2 py-1.5" style="border-left: 3px solid {color}">
    <span class="text-xs text-neutral-500 w-5 text-center shrink-0">
      {track.index === 0 ? 'M' : track.index}
    </span>
    <span class="text-sm text-neutral-200 font-medium truncate flex-1">{track.name}</span>

    <!-- Buttons -->
    <ToggleButton active={isMuted} onclick={toggleMute} label="M"
      activeColor="bg-red-600" inactiveColor="bg-neutral-800" small={true} />
    <ToggleButton active={isSoloed} onclick={toggleSolo} label="S"
      activeColor="bg-yellow-500" inactiveColor="bg-neutral-800"
      activeTextColor="text-black" small={true} />
    <ToggleButton active={isArmed} onclick={toggleArm} label="R"
      activeColor="bg-red-600" inactiveColor="bg-neutral-800" small={true} />
    <button
      type="button"
      onclick={cycleMonitor}
      class="min-w-8 min-h-8 px-1.5 py-1 text-xs rounded font-bold
             {recMon === 'on' ? 'bg-green-700 text-white'
              : recMon === 'auto' ? 'bg-neutral-700 text-green-400'
              : 'bg-neutral-800 text-neutral-500'}"
    >{recMon === 'auto' ? 'A' : 'MON'}</button>
  </div>

  <!-- Fader + meter -->
  <div class="px-2 pb-1">
    <Fader value={track.volume} onchange={setVol} />
    <MeterBar peakL={track.peakL} peakR={track.peakR} />
  </div>

  <!-- Sends toggle -->
  {#if track.sendCount > 0}
    <button
      type="button"
      onclick={() => expanded = !expanded}
      class="w-full text-[10px] text-neutral-500 py-0.5 hover:text-neutral-300"
    >
      {expanded ? '▾' : '▸'} {track.sendCount} send{track.sendCount > 1 ? 's' : ''}
    </button>

    {#if expanded}
      <div class="pb-1">
        {#each sends as { sendIndex, send } (sendIndex)}
          <TrackSend trackIndex={track.index} {sendIndex} {send} />
        {/each}
      </div>
    {/if}
  {/if}
</div>
