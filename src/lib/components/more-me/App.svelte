<script>
  import { onMount } from 'svelte'
  import { initReaper, onAfterReply } from '$lib/reaper/api.svelte.js'
  import { monitorStore } from '$lib/stores/monitor.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'
  import { reaperColorToCSS } from '$lib/reaper/helpers.js'
  import MasterOutput from './MasterOutput.svelte'
  import ReceiveList from './ReceiveList.svelte'

  onMount(() => {
    initReaper('more-me')
    const unsub = onAfterReply(() => monitorStore.pollReceives())
    return unsub
  })

  let monitorTracks = $derived(tracksStore.getMonitorTracks())
  let hasSelection = $derived(monitorStore.selectedTrackIndex >= 0)
  let selectedTrack = $derived(monitorStore.selectedTrack)

  function selectTrack(index) {
    monitorStore.selectedTrackIndex = index
  }

  function goBack() {
    monitorStore.selectedTrackIndex = -1
  }
</script>

<div class="min-h-screen max-w-2xl mx-auto p-4 flex flex-col gap-4">
  {#if hasSelection}
    <!-- Mix view -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        onclick={goBack}
        class="text-sm text-neutral-400 active:text-neutral-200"
      >&larr;</button>
      <h1 class="text-xl font-bold text-neutral-200">{selectedTrack?.name ?? ''}</h1>
    </div>

    <MasterOutput />
    <ReceiveList />
  {:else if monitorTracks.length > 0}
    <!-- Monitor mix list -->
    <h1 class="text-xl font-bold text-neutral-200">Select your mix</h1>
    <div class="flex flex-col gap-2">
      {#each monitorTracks as track (track.index)}
        {@const color = reaperColorToCSS(track.color)}
        <button
          type="button"
          onclick={() => selectTrack(track.index)}
          class="flex items-center gap-3 p-4 rounded-lg bg-neutral-800 active:bg-neutral-700 transition-colors text-left"
        >
          <div
            class="w-4 h-4 rounded-full shrink-0"
            style="background-color: {color || '#555'}"
          ></div>
          <span class="text-lg text-neutral-200 font-medium">{track.name}</span>
          <span class="ml-auto text-sm text-neutral-500">{track.recvCount} ch</span>
        </button>
      {/each}
    </div>
  {:else}
    <!-- No monitor tracks available -->
    <h1 class="text-xl font-bold text-neutral-200">More Me</h1>
    <div class="text-neutral-500 text-sm text-center py-8 px-4">
      <p class="mb-4">No monitor mixes found.</p>
      <p class="mb-2">Each performer needs a dedicated monitor track in REAPER.</p>
      <p class="mb-2">Set it to receive sends from all the tracks you want to monitor.</p>
      <p class="mb-2">Give it a hardware send to the performer's output in its first send slot.</p>
      <p>Don't forget to disable its Master Send.</p>
    </div>
  {/if}
</div>
