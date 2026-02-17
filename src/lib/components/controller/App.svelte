<script>
  import { onMount } from 'svelte'
  import { initReaper } from '$lib/reaper/api.svelte.js'
  import TransportBar from './TransportBar.svelte'
  import NavPanel from './NavPanel.svelte'
  import UtilityBar from './UtilityBar.svelte'
  import JogWheel from './JogWheel.svelte'
  import TrackMixer from './TrackMixer.svelte'

  onMount(() => {
    initReaper('controller')
  })
</script>

<div class="min-h-screen flex flex-col lg:flex-row">
  <!-- Left column: transport, jog, nav, utilities -->
  <div class="lg:w-[380px] lg:shrink-0 p-4 flex flex-col gap-4 lg:h-screen lg:overflow-y-auto lg:border-r lg:border-neutral-800">
    <TransportBar />
    <JogWheel />
    <NavPanel />
    <UtilityBar />
  </div>

  <!-- Right column: track mixer -->
  <div class="flex-1 p-4 lg:h-screen lg:overflow-y-auto">
    <TrackMixer />
  </div>
</div>
