<script>
  import { transportStore } from '$lib/stores/transport.svelte.js'
  import { tracksStore } from '$lib/stores/tracks.svelte.js'
  import { wwr_req } from '$lib/reaper/api.svelte.js'
  import { CMD } from '$lib/reaper/commands.js'
  import { TrackFlags } from '$lib/reaper/helpers.js'

  let isRecording = $derived(transportStore.isRecording)

  let armedCount = $derived.by(() => {
    let count = 0
    for (const t of tracksStore.tracks) {
      if (t && (t.flags & TrackFlags.REC_ARMED)) count++
    }
    return count
  })

  function abort() {
    wwr_req(String(CMD.RECORD_ABORT))
  }
</script>

{#if isRecording}
  <button
    type="button"
    onclick={abort}
    class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-900/60 text-red-300 text-xs font-bold
           active:brightness-75 min-h-11"
  >
    <span class="text-base">&#x2717;</span>
    ABORT
  </button>
{:else if armedCount > 0}
  <div class="flex items-center gap-1.5 text-xs text-red-400">
    <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
    {armedCount} armed
  </div>
{/if}
