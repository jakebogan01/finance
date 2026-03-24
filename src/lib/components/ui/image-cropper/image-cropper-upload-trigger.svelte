<script>
	import { useImageCropperTrigger } from './image-cropper.svelte.js';

	let { ref = $bindable(null), children, ...rest } = $props();

	const triggerState = useImageCropperTrigger();
</script>

<label {...rest} bind:this={ref} for={triggerState.rootState.id} class="md:hover:cursor-pointer">
	{@render children?.()}
</label>
