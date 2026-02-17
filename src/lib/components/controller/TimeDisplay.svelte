<script>
  import { transportStore } from '$lib/stores/transport.svelte.js'

  let posStr = $derived(transportStore.positionString)

  // Detect time format from the position string
  let formatLabel = $derived.by(() => {
    if (!posStr) return ''
    const parts = posStr.split('.')
    if (parts[1] === undefined) {
      return posStr.includes(':') ? 'H:M:S:F' : 'Samples'
    }
    if (parts[1].length === 3) {
      return posStr.includes(':') ? 'M:S.ms' : 'Seconds'
    }
    return 'Measures.Beats'
  })
</script>

<div class="text-center">
  <div class="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-neutral-200 tracking-wide">
    {posStr || '--'}
  </div>
  <div class="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
    {formatLabel}
  </div>
</div>
