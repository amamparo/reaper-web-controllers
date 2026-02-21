<script>
  import ToggleButton from '$lib/components/shared/ToggleButton.svelte'
  import { transportStore } from '$lib/stores/transport.svelte.js'
  import { wwr_req } from '$lib/reaper/api.svelte.js'
  import { CMD } from '$lib/reaper/commands.js'

  function toggleMetronome() { wwr_req(String(CMD.METRONOME)) }
  function toggleSnap() { wwr_req(String(CMD.SNAP)) }
  function toggleRepeat() { wwr_req('SET/REPEAT/-1') }
</script>

<div class="flex items-center gap-2">
  <ToggleButton
    active={transportStore.metronomeOn}
    onclick={toggleMetronome}
    label="METRO"
    activeColor="bg-sky-700"
    inactiveColor="bg-neutral-900"
  />
  <ToggleButton
    active={transportStore.snapOn}
    onclick={toggleSnap}
    label="SNAP"
    activeColor="bg-sky-700"
    inactiveColor="bg-neutral-900"
  />
  <ToggleButton
    active={transportStore.repeatOn}
    onclick={toggleRepeat}
    label="LOOP"
    activeColor="bg-teal-700"
    inactiveColor="bg-neutral-900"
  />
</div>
