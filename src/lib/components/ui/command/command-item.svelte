<script>
	import { Command as CommandPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<CommandPrimitive.Item bind:ref data-slot="command-item" class={cn('', className)} {...restProps} />
