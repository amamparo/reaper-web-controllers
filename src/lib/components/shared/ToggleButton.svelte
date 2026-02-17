<script>
  let {
    active = false,
    onclick,
    label = '',
    activeColor = 'bg-red-600',
    inactiveColor = 'bg-neutral-700',
    activeTextColor = 'text-white',
    inactiveTextColor = 'text-neutral-400',
    small = false,
  } = $props()
</script>

<button
  type="button"
  onclick={onclick}
  class="
    rounded font-bold select-none
    {small ? 'min-w-8 min-h-8 px-1.5 py-1 text-xs' : 'min-w-11 min-h-11 px-2.5 py-2 text-sm'}
    {active ? activeColor : inactiveColor}
    {active ? activeTextColor : inactiveTextColor}
    active:brightness-75 transition-colors
  "
>
  {label}
</button>
