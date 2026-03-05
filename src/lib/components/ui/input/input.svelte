<script>
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		...restProps
	} = $props();
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
			'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
			'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'mb-0 flex h-13 w-full min-w-0 rounded-lg border border-grey-300 bg-grey-900 px-4 ring-offset-yellow-100 outline-none selection:bg-yellow-100 selection:text-grey-1100 placeholder:text-grey-200 disabled:cursor-not-allowed disabled:opacity-50 md:transition-colors md:hover:border-yellow-200',
			'focus-visible:border-yellow-100 focus-visible:ring-[3px] focus-visible:ring-yellow-200/500',
			'aria-invalid:border-red-200 aria-invalid:ring-red-100/20',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
