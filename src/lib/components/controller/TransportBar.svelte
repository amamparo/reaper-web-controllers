<script>
  import { transportStore } from '$lib/stores/transport.svelte.js'
  import { wwr_req } from '$lib/reaper/api.svelte.js'
  import { CMD } from '$lib/reaper/commands.js'
  import TimeDisplay from './TimeDisplay.svelte'
  import TimeSigDisplay from './TimeSigDisplay.svelte'
  import BeatIndicator from './BeatIndicator.svelte'
  import RecordPanel from './RecordPanel.svelte'

  function stop() { wwr_req(String(CMD.STOP_ALL)) }
  function play() { wwr_req(String(CMD.PLAY)) }
  function pause() { wwr_req(String(CMD.PAUSE)) }
  function record() { wwr_req(String(CMD.RECORD)) }
</script>

<div class="flex flex-col gap-3">
  <!-- Time display + beat indicator -->
  <div class="flex items-center gap-3">
    <BeatIndicator />
    <div class="flex-1 flex flex-col gap-1">
      <TimeDisplay />
      <div class="flex justify-center">
        <TimeSigDisplay />
      </div>
    </div>
  </div>

  <!-- Transport buttons -->
  <div class="flex items-center gap-2 justify-center">
    <button
      type="button"
      onclick={stop}
      class="w-14 h-14 rounded-lg flex items-center justify-center text-2xl
             {transportStore.playState === 0 ? 'bg-neutral-600 text-white' : 'bg-neutral-800 text-neutral-400'}
             active:brightness-75"
    >&#9632;</button>

    <button
      type="button"
      onclick={play}
      class="w-14 h-14 rounded-lg flex items-center justify-center text-2xl
             {transportStore.isPlaying ? 'bg-green-700 text-white' : 'bg-neutral-800 text-neutral-400'}
             active:brightness-75"
    >&#9654;</button>

    <button
      type="button"
      onclick={pause}
      class="w-14 h-14 rounded-lg flex items-center justify-center text-xl
             {transportStore.isPaused ? 'bg-amber-700 text-white' : 'bg-neutral-800 text-neutral-400'}
             active:brightness-75"
    >&#9646;&#9646;</button>

    <button
      type="button"
      onclick={record}
      aria-label="Record"
      class="w-14 h-14 rounded-lg flex items-center justify-center
             {transportStore.isRecording ? 'bg-red-600 text-white' : 'bg-neutral-800 text-red-400'}
             active:brightness-75"
    >
      <span class="w-6 h-6 rounded-full
        {transportStore.isRecording ? 'bg-white' : 'bg-red-500'}
      "></span>
    </button>

    <RecordPanel />
  </div>
</div>
