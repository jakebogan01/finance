<script>
	import { Button } from '$lib/components/ui/button/index.js';

	let { children, ...props } = $props();
</script>

<Button
	class={['h-13 bg-yellow-200 font-medium text-grey-800 md:hover:bg-yellow-100', props.class]}
>
	{@render children?.()}
</Button>
