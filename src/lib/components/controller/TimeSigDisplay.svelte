<script>
  import { transportStore } from '$lib/stores/transport.svelte.js'
</script>

<div class="flex items-center gap-0.5 text-neutral-400 font-mono text-sm">
  <span class="font-bold">{transportStore.tsNumerator}</span>
  <span class="text-neutral-600">/</span>
  <span class="font-bold">{transportStore.tsDenominator}</span>
</div>
