<script>
  import { monitorStore } from '$lib/stores/monitor.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'

  let monitorTracks = $derived(tracksStore.getMonitorTracks())

  function handleChange(e) {
    const name = e.target.value
    if (!name) {
      monitorStore.selectedTrackIndex = -1
      return
    }
    const track = monitorTracks.find(t => t.name === name)
    monitorStore.selectedTrackIndex = track ? track.index : -1
  }
</script>

<select
  onchange={handleChange}
  class="w-full bg-neutral-900 text-neutral-200 border-none rounded-2xl text-lg p-3 outline-none"
>
  <option value="">Select your monitor track...</option>
  {#each monitorTracks as track}
    <option value={track.name}>{track.name}</option>
  {/each}
</select>
