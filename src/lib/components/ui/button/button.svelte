<script module>
	import { tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-lg whitespace-nowrap md:transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground md:hover:bg-primary/90',
				destructive:
					'bg-destructive md:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
				outline:
					'bg-background md:hover:bg-accent md:hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:md:hover:bg-input/50 border',
				secondary: 'bg-secondary text-secondary-foreground md:hover:bg-secondary/80',
				ghost: 'md:hover:bg-accent md:hover:text-accent-foreground dark:md:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 md:hover:underline'
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9',
				'icon-sm': 'size-8',
				'icon-lg': 'size-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});
</script>

<script>
	import { cn } from '$lib/utils.js';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';

	let {
		ref = $bindable(null),
		variant = 'default',
		size = 'default',
		href = undefined,
		type = 'button',
		loading = false,
		disabled = false,
		tabindex = 0,
		onclick,
		onClickPromise,
		class: className,
		'data-slot': dataSlot = 'button',
		children,
		...rest
	} = $props();
</script>

<!-- This approach to disabled links is inspired by bits-ui see: https://github.com/huntabyte/bits-ui/pull/1055 -->
<svelte:element
	this={href ? 'a' : 'button'}
	{...rest}
	data-slot={dataSlot}
	type={href ? undefined : type}
	href={href && !disabled ? href : undefined}
	disabled={href ? undefined : disabled || loading}
	aria-disabled={href ? disabled : undefined}
	role={href && disabled ? 'link' : undefined}
	tabindex={href && disabled ? -1 : tabindex}
	class={cn(buttonVariants({ variant, size }), className)}
	bind:this={ref}
	onclick={async (e) => {
		onclick?.(e);

		if (type === undefined) return;

		if (onClickPromise) {
			loading = true;

			await onClickPromise(e);

			loading = false;
		}
	}}
>
	{#if type !== undefined && loading}
		<div class="flex animate-spin place-items-center justify-center">
			<LoaderCircleIcon class="size-4" />
		</div>
		<span class="sr-only">Loading</span>
	{/if}
	{@render children?.()}
</svelte:element>
