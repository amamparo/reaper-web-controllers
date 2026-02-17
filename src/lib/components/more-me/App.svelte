<script>
  import { onMount } from 'svelte'
  import { initReaper, onAfterReply } from '$lib/reaper/api.svelte.js'
  import { monitorStore } from '$lib/stores/monitor.svelte.js'
  import MonitorSelect from './MonitorSelect.svelte'
  import MasterOutput from './MasterOutput.svelte'
  import ReceiveList from './ReceiveList.svelte'

  let connected = $state(false)

  onMount(() => {
    initReaper('more-me')
    connected = true
    const unsub = onAfterReply(() => monitorStore.pollReceives())
    return unsub
  })

  let hasSelection = $derived(monitorStore.selectedTrackIndex >= 0)
</script>

<div class="min-h-screen max-w-2xl mx-auto p-4 flex flex-col gap-4">
  <h1 class="text-xl font-bold text-neutral-200">More Me</h1>

  <MonitorSelect />

  {#if hasSelection}
    <MasterOutput />
    <ReceiveList />
  {:else}
    <div class="text-neutral-500 text-sm text-center py-8 px-4">
      <p class="mb-4">Each performer needs a dedicated monitor track in REAPER.</p>
      <p class="mb-2">Set it to receive sends from all the tracks you want to monitor.</p>
      <p class="mb-2">Give it a hardware send to the performer's output in its first send slot.</p>
      <p>Don't forget to disable its Master Send.</p>
    </div>
  {/if}
</div>
