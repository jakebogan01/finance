<script>
	import { Switch as SwitchPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		...restProps
	} = $props();
</script>

<SwitchPrimitive.Root
	bind:ref
	bind:checked
	data-slot="switch"
	class={cn(
		'focus-visible:border-ring focus-visible:ring-ring/50 peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-grey-300 transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-yellow-200 data-[state=unchecked]:bg-grey-300 dark:data-[state=unchecked]:bg-blue-500/80',
		className
	)}
	{...restProps}
>
	<SwitchPrimitive.Thumb
		data-slot="switch-thumb"
		class={cn(
			'pointer-events-none block size-5 rounded-full border border-grey-200 bg-grey-800 ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%)] data-[state=unchecked]:translate-x-px dark:border-grey-300 dark:bg-white dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-gray-50'
		)}
	/>
</SwitchPrimitive.Root>
